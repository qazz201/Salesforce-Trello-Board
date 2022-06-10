public with sharing class DropBoxApi {
    private static final String ROOT_PATH_CONTENT = 'callout:DropBoxContent';
    private static final String ROOT_PATH_UPLOAD = ROOT_PATH_CONTENT + '/files/upload';
    //https://api.dropboxapi.com/2/file_requests/count POST
    private static final Map<String, Object> uploadFileHeader = new Map<String, Object>{
            'mode' => 'add',
            'autorename' => true,
            'mute' => false,
            'strict_conflict' => false
    };

    @AuraEnabled
    public static void uploadFile(String activityId, String fileName, String bodyBase64) {
        uploadFileHeader.put('path', '/' + fileName);

        String resp = new CalloutClient(ROOT_PATH_UPLOAD)
                .setHeader('Content-Type', 'application/octet-stream')
                .setHeader('Dropbox-API-Arg', JSON.serialize(uploadFileHeader))
                .post(EncodingUtil.base64Decode(bodyBase64))
                .getBody();
        System.debug((FileUploadResponse) JSON.deserialize(resp, FileUploadResponse.class));

        createBoardActivityAttachment((FileUploadResponse) JSON.deserialize(resp, FileUploadResponse.class), activityId);
    }

    private static void createBoardActivityAttachment(FileUploadResponse uploadResponse, String activityId) {
        Map<String, Object> mp = new Map<String, Object>{
                'path' => uploadResponse.path_display
        };

        String resp = new CalloutClient('callout:DropBoxApi' + '/sharing/create_shared_link_with_settings')
                .setHeader('Content-Type', 'application/json')
                .post(JSON.serialize(mp))
                .getBody();

        FileSharing fileSharing = (FileSharing) JSON.deserialize(resp, FileSharing.class);

        insert new BoardActivityAttachment__c(
                BoardActivity__c = activityId,
                DropBoxFileId__c = fileSharing.id,
                DropBoxFilePath__c = uploadResponse.path_display,
                DropBoxFileURL__c = fileSharing.url,
                Name = fileSharing.name);
    }

    class FileUploadResponse {
        public String name;
        public String path_display;
        public String id;
    }

    class FileSharing {
        public String name;
        public String url;
        public String id;
    }
}