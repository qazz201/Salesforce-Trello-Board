@IsTest
public class TestFactory {
    public static String BOARD_NAME = 'Test Board';
    public static String ACTIVITY_TYPE_NAME = 'Test Activity Type';
    public static String ACTIVITY_NAME = 'Test Activity';

    public static KanbanBoard__c createBoard() {
        KanbanBoard__c board = new KanbanBoard__c(Name = BOARD_NAME);
        insert board;
        return board;
    }

    public static BoardActivityType__c createBoardActivityType(String activityTypeName) {
        KanbanBoard__c board = createBoard();
        BoardActivityType__c boardActivityType = new BoardActivityType__c(Name = activityTypeName, Board__c = board.Id);
        insert boardActivityType;
        return boardActivityType;
    }

    public static BoardActivityType__c createBoardActivityType() {
        return createBoardActivityType(ACTIVITY_TYPE_NAME);
    }

    public static BoardActivity__c createBoardActivity(String activityName) {
        BoardActivityType__c boardActivityType = createBoardActivityType();
        BoardActivity__c boardActivity = new BoardActivity__c(
                Name = activityName,
                Status__c = 'Open',
                ActivityType__c = boardActivityType.Id);
        insert boardActivity;
        return boardActivity;
    }

    public static BoardActivity__c createBoardActivity(Id boardActivityTypeId) {
        BoardActivityType__c boardActivityType = createBoardActivityType();
        BoardActivity__c boardActivity = new BoardActivity__c(
                Name = ACTIVITY_NAME,
                Status__c = 'Open',
                ActivityType__c = boardActivityTypeId);
        insert boardActivity;
        return boardActivity;
    }

    public static BoardActivity__c createBoardActivity() {
        return createBoardActivity(ACTIVITY_NAME);
    }
}