public with sharing class KanbanBoardController {

    @AuraEnabled
    public static List<KanbanBoard__c>getBoards() {
        return [SELECT Id, Name FROM KanbanBoard__c];
    }

    @AuraEnabled
    public static Board getBoardActivities(String boardId) {
        Map<Id, BoardActivityType__c> boardActivityTypes = getBoardActivityTypes(boardId);
        Map<Id, BoardActivity__c> boardActivities = getBoardActivitiesByType(boardActivityTypes.keySet());
        Map<Id, List<BoardActivity__c>> boardActivityTypeIdToActivities = getBoardActivityTypeToActivity(boardActivityTypes.keySet(), boardActivities.values());

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

    @AuraEnabled
    public static List<BoardActivityAttachment__c> getActivityAttachments(String activityId) {
        return [
                SELECT
                        BoardActivity__c,
                        DropBoxFileId__c,
                        DropBoxFilePath__c,
                        DropBoxFileURL__c,
                        Id,
                        Name
                FROM BoardActivityAttachment__c
                WHERE BoardActivity__c = :activityId
        ];
    }

    @AuraEnabled
    public static void updateActivityType(String activityTypeId, String activityId) {
        BoardActivity__c act = [SELECT Id, ActivityType__c FROM BoardActivity__c WHERE Id = :activityId LIMIT 1];
        if (activityTypeId == null) return;

        act.ActivityType__c = activityTypeId;
        update act;
    }

    private static Map<Id, BoardActivityType__c> getBoardActivityTypes(String boardId) {
        return new Map<Id, BoardActivityType__c>([
                SELECT Available_Status__c,
                        Board__c,
                        Id,
                        Name
                FROM BoardActivityType__c
                WHERE Board__c = :boardId
        ]);
    }

    private static Map<Id, BoardActivity__c> getBoardActivitiesByType(Set<Id> activityTypes) {
        return new Map<Id, BoardActivity__c>([
                SELECT ActivityType__c,
                        ActivityType__r.Name,
                        Id,
                        Name,
                        Status__c,
                        Attachments__c
                FROM BoardActivity__c
                WHERE ActivityType__c IN :activityTypes
        ]);
    }

    private static Map<Id, List<BoardActivity__c>> getBoardActivityTypeToActivity(Set<Id> activityTypeIds, List<BoardActivity__c> boardActivities) {
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