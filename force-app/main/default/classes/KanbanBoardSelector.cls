public with sharing class KanbanBoardSelector {

    public List<KanbanBoard__c>getBoards() {
        return [SELECT Id, Name FROM KanbanBoard__c];
    }

    public BoardActivity__c getBoardActivityById(String activityId) {
        return [SELECT Id, ActivityType__c FROM BoardActivity__c WHERE Id = :activityId LIMIT 1];
    }

    public BoardActivityAttachment__c getBoardActivityAttachmentByFilePath(String filePath) {
        return [
                SELECT
                        BoardActivity__c,
                        DropBoxFileId__c,
                        DropBoxFilePath__c,
                        DropBoxFileURL__c,
                        Name
                FROM BoardActivityAttachment__c
                WHERE DropBoxFilePath__c = :filePath
                LIMIT 1
        ];
    }

    public Map<Id, BoardActivityType__c> getBoardActivityTypes(String boardId) {
        return new Map<Id, BoardActivityType__c>([
                SELECT Available_Status__c,
                        Board__c,
                        Id,
                        Name
                FROM BoardActivityType__c
                WHERE Board__c = :boardId
        ]);
    }

    public Map<Id, BoardActivity__c> getBoardActivitiesByType(Set<Id> activityTypes) {
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

    public List<BoardActivityAttachment__c> getActivityAttachments(String activityId) {
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

}