public with sharing class KanbanBoardService {
    private KanbanBoardSelector kanbanBoardSelector = new KanbanBoardSelector();

    public void updateActivityType(String activityTypeId, String activityId) {
        if (activityTypeId == null) return;

        BoardActivity__c act = kanbanBoardSelector.getBoardActivityById(activityId);
        act.ActivityType__c = activityTypeId;
        update act;
    }

    public Board getBoardActivities(String boardId) {
        Map<Id, BoardActivityType__c> boardActivityTypes = kanbanBoardSelector.getBoardActivityTypes(boardId);
        Map<Id, BoardActivity__c> boardActivities = kanbanBoardSelector.getBoardActivitiesByType(boardActivityTypes.keySet());
        Map<Id, List<BoardActivity__c>> boardActivityTypeIdToActivities = this.getBoardActivityTypeToActivity(boardActivityTypes.keySet(), boardActivities.values());

        List<BoardSection> boardSections = new List<BoardSection>();

        for (Id activityTypeId : boardActivityTypeIdToActivities.keySet()) {
            BoardActivityType__c boardActivityType = boardActivityTypes.get(activityTypeId);
            List<BoardSectionItem> boardSectionItems = new List<BoardSectionItem>();

            for (BoardActivity__c activity : boardActivityTypeIdToActivities.get(activityTypeId)) {
                boardSectionItems.add(new BoardSectionItem(activity.Id, activity.Name, activity.Status__c, activity.Attachments__c));
            }

            boardSections.add(new BoardSection(boardActivityType.id, boardActivityType.Name, boardSectionItems));
        }

        return new Board(boardSections);
    }

    private Map<Id, List<BoardActivity__c>> getBoardActivityTypeToActivity(Set<Id> activityTypeIds, List<BoardActivity__c> boardActivities) {
        Map<Id, List<BoardActivity__c>> boardActivityTypeIdToActivities = new Map<Id, List<BoardActivity__c>>();

        for (Id activityTypeId : activityTypeIds) {
            List<BoardActivity__c> activities = new List<BoardActivity__c>();

            for (BoardActivity__c activity : boardActivities) {
                if (activityTypeId == activity.ActivityType__c) activities.add(activity);
            }

            boardActivityTypeIdToActivities.put(activityTypeId, activities);
        }

        return boardActivityTypeIdToActivities;
    }

    public class Board {
        @AuraEnabled
        public List<BoardSection> sections;

        public Board(List<BoardSection> sections) {
            this.sections = sections;
        }
    }

    public class BoardSection {
        @AuraEnabled
        public Id sectionId;
        @AuraEnabled
        public String sectionName;
        @AuraEnabled
        public List<BoardSectionItem> sectionItems;

        public BoardSection(Id sectionId, String sectionName, List<BoardSectionItem> sectionItems) {
            this.sectionId = sectionId;
            this.sectionName = sectionName;
            this.sectionItems = sectionItems;
        }
    }

    public class BoardSectionItem {
        @AuraEnabled
        public Id id;
        @AuraEnabled
        public String name;
        @AuraEnabled
        public String status;
        @AuraEnabled
        public Decimal attachments;

        public BoardSectionItem(Id id, String name, String status, Decimal attachments) {
            this.id = id;
            this.name = name;
            this.status = status;
            this.attachments = attachments;
        }
    }
}