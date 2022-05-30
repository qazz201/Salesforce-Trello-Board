public with sharing class KanbanBoardController {

    @AuraEnabled
    public static List<String> getSprintTasks() {
        Schema.DescribeFieldResult fieldResult = BoardActivityType__c.Available_Status__c.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();

        List<String> pickListValuesList = new List<String>();

        for (Schema.PicklistEntry pickListVal : ple) {
            pickListValuesList.add(pickListVal.getLabel());
        }
        return pickListValuesList;
    }

    @AuraEnabled
    public static List<KanbanBoard__c>getBoards() {
        return [SELECT Id, Name FROM KanbanBoard__c];
    }

    @AuraEnabled
    public static void getBoardActivities(String boardId) {
        Map<Id, BoardActivityType__c> boardActivityTypes = getBoardActivityTypes(boardId);
        Map<Id, BoardActivity__c> boardActivities = getBoardActivitiesByType(boardActivityTypes.keySet());


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
                        Status__c
                FROM BoardActivity__c
                WHERE ActivityType__c IN :activityTypes
        ]);
    }
}