@IsTest
private class KanbanBoardServiceTest {
    private static final String ACTIVITY_TYPE_NAME = 'Activity Type #2';

    @TestSetup
    static void setup() {
        BoardActivityType__c boardActivityType = TestFactory.createBoardActivityType(ACTIVITY_TYPE_NAME);
        TestFactory.createBoardActivity();
        TestFactory.createBoardActivity(boardActivityType.Id);
    }

    @IsTest
    static void updateActivityTypeTest() {
        BoardActivity__c boardActivityBefore = [SELECT Id, ActivityType__c FROM BoardActivity__c LIMIT 1];
        BoardActivityType__c boardActivityType = [SELECT Id FROM BoardActivityType__c LIMIT 1];

        Test.startTest();
        new KanbanBoardService().updateActivityType(boardActivityType.Id, boardActivityBefore.Id);
        Test.stopTest();

        BoardActivity__c boardActivityAfter = [SELECT Id, ActivityType__c FROM BoardActivity__c LIMIT 1];
        System.assertNotEquals(boardActivityBefore.ActivityType__c, boardActivityAfter.ActivityType__c);
    }

    @IsTest
    static void getBoardActivitiesTest() {
        KanbanBoard__c kanbanBoard = [SELECT Id, Name FROM KanbanBoard__c WHERE Name = :TestFactory.BOARD_NAME LIMIT 1];

        Test.startTest();
        KanbanBoardService.Board boardActivities = new KanbanBoardService().getBoardActivities(kanbanBoard.Id);
        Test.stopTest();

        System.assertNotEquals(0, boardActivities.sections[0].sectionItems.size());
    }
}