public with sharing class KanbanBoardController {
    private static KanbanBoardSelector kanbanBoardSelector = new KanbanBoardSelector();
    private static KanbanBoardService kanbanBoardService = new KanbanBoardService();

    @AuraEnabled
    public static List<KanbanBoard__c>getBoards() {
        return kanbanBoardSelector.getBoards();
    }

    @AuraEnabled
    public static KanbanBoardService.Board getBoardActivities(String boardId) {
        return kanbanBoardService.getBoardActivities(boardId);
    }

    @AuraEnabled
    public static List<BoardActivityAttachment__c> getActivityAttachments(String activityId) {
        return kanbanBoardSelector.getActivityAttachments(activityId);
    }

    @AuraEnabled
    public static void updateActivityType(String activityTypeId, String activityId) {
        kanbanBoardService.updateActivityType(activityTypeId, activityId);
    }
}