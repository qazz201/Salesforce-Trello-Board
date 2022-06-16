@IsTest
private class DropBoxApiServiceTest {
    private static final String ACTIVITY_NAME = 'Test Activity';
    private static final String UPLOAD_FILE_NAME = 'Next.txt';

    @TestSetup
    static void setup() {
        TestFactory.createBoardActivity(ACTIVITY_NAME);
    }

    @IsTest
    static void uploadFileTest() {
        BoardActivity__c boardActivity = [SELECT Id, Name FROM BoardActivity__c WHERE Name = :ACTIVITY_NAME];

        setMocksForUploadFileAndGetSharedLink(200, 200);

        Test.startTest();
        Boolean isSuccess = new DropBoxApiService().uploadFile(boardActivity.Id, UPLOAD_FILE_NAME, 'SGVsbG8=');
        Test.stopTest();

        System.assertEquals(true, isSuccess);
        System.assertNotEquals(0,
                DropBoxApiService.kanbanBoardSelector.getActivityAttachments(boardActivity.Id).size(),
                'The Attachment should be created for the Activity');
    }

    @IsTest
    static void fileSharingLinkAlreadyExistTest() {
        BoardActivity__c boardActivity = [SELECT Id, Name FROM BoardActivity__c WHERE Name = :ACTIVITY_NAME];
        insert new BoardActivityAttachment__c(
                DropBoxFilePath__c = '/' + UPLOAD_FILE_NAME,
                BoardActivity__c = boardActivity.Id);

        setMocksForUploadFileAndGetSharedLink(200, 409);

        Test.startTest();
        Boolean isSuccess = new DropBoxApiService().uploadFile(boardActivity.Id, UPLOAD_FILE_NAME, 'SGVsbG8=');
        Test.stopTest();

        System.assertEquals(true, isSuccess);
        System.assertNotEquals(null,
                DropBoxApiService.kanbanBoardSelector.getBoardActivityAttachmentByFilePath('/' + UPLOAD_FILE_NAME),
                'The Attachment should be created for the Activity');
    }

    private static void setMocksForUploadFileAndGetSharedLink(Integer fakeUploadFileStatus, Integer fakeSharedFileLinkStatus) {
        CalloutMock fakeUploadFileResp = new CalloutMock(fakeUploadFileStatus, getUploadFileResponse());
        CalloutMock fakeSharedFileLinkResponse = new CalloutMock(fakeSharedFileLinkStatus, getSharedFileLinkResponse());

        Map<String, HttpCalloutMock> endpointUrlToFakeResp = new Map<String, HttpCalloutMock>();
        endpointUrlToFakeResp.put(DropBoxApiService.PATH_UPLOAD_FILE, fakeUploadFileResp);
        endpointUrlToFakeResp.put(DropBoxApiService.PATH_CREATE_SHARED_LINK, fakeSharedFileLinkResponse);

        HttpCalloutMock multiCalloutMock = new MultiRequestMock(endpointUrlToFakeResp);
        Test.setMock(HttpCalloutMock.class, multiCalloutMock);
    }


    private static String getUploadFileResponse() {
        return '{"name":"' + UPLOAD_FILE_NAME + '",' +
                '"path_lower": "/next.txt",' +
                '"path_display": "/Next.txt",' +
                '"id": "id:BkbDAdpazdkAAAAsAAAAAkIg"' +
                '}';
    }

    private static String getSharedFileLinkResponse() {
        return '{"url": "https://www.dropbox.com/s/dbdlu2btcxquti/Next.txt?dl=0",' +
                '"id": "id:BkbDAdpazdkAAAAAAsAAAJQ", ' +
                '"name": "' + UPLOAD_FILE_NAME + '"' +
                '}';
    }

    public class CalloutMock implements HttpCalloutMock {
        private Integer statusCode;
        private String respBody;

        public CalloutMock(Integer statusCode, String respBody) {
            this.statusCode = statusCode;
            this.respBody = respBody;
        }

        public HttpResponse respond(HttpRequest request) {
            HttpResponse response = new HttpResponse();
            response.setStatusCode(this.statusCode);

            if (respBody != null) response.setBody(respBody);
            return response;
        }
    }

    public class MultiRequestMock implements HttpCalloutMock {
        Map<String, HttpCalloutMock> requests;

        public MultiRequestMock(Map<String, HttpCalloutMock> requests) {
            this.requests = requests;
        }

        public HTTPResponse respond(HTTPRequest req) {
            HttpCalloutMock mock = requests.get(req.getEndpoint());
            if (mock != null) {
                return mock.respond(req);
            } else {
                throw new MockException('HTTP callout not supported for test methods');
            }
        }

        public void addRequestMock(String url, HttpCalloutMock mock) {
            requests.put(url, mock);
        }
    }

    public class MockException extends Exception {
    }

}