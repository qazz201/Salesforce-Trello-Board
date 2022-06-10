public with sharing class DropBoxApi {
    private static final String PATH_UPLOAD = 'callout:DropBoxContent/files/upload';
    private static final String PATH_CREATE_SHARED_LINK = 'callout:DropBoxApi/sharing/create_shared_link_with_settings';
    private static final Map<String, Object> uploadFileHeader = new Map<String, Object>{
            'mode' => 'add',
            'autorename' => true,
            'mute' => false,
            'strict_conflict' => false
    };

    @AuraEnabled
    public static Boolean uploadFile(String activityId, String fileName, String bodyBase64) {
        try {
            uploadFileHeader.put('path', '/' + fileName);

            String resp = new CalloutClient(PATH_UPLOAD)
                    .setHeader('Content-Type', 'application/octet-stream')
                    .setHeader('Dropbox-API-Arg', JSON.serialize(uploadFileHeader))
                    .post(EncodingUtil.base64Decode(bodyBase64))
                    .getBody();

            createBoardActivityAttachment((FileUploadResponse) JSON.deserialize(resp, FileUploadResponse.class), activityId);
            return true;
        } catch (Exception ex) {
            System.debug(ex);
            throw new InsertException(ex);
        }
    }

    private static void createBoardActivityAttachment(FileUploadResponse uploadResponse, String activityId) {
        HttpResponse resp = new CalloutClient(PATH_CREATE_SHARED_LINK)
                .setHeader('Content-Type', 'application/json')
                .post(JSON.serialize(new Map<String, Object>{
                        'path' => uploadResponse.path_display
                }));

        // the sharing link already exist
        if (resp.getStatusCode() == 409) {
            cloneBoardActivityAttachment(uploadResponse, activityId);
            return;
        }

        FileSharingResponse fileSharing = (FileSharingResponse) JSON.deserialize(resp.getBody(), FileSharingResponse.class);

        insert new BoardActivityAttachment__c(
                BoardActivity__c = activityId,
                DropBoxFileId__c = fileSharing.id,
                DropBoxFilePath__c = uploadResponse.path_display,
                DropBoxFileURL__c = fileSharing.url,
                Name = fileSharing.name);
    }

    private static void cloneBoardActivityAttachment(FileUploadResponse uploadResponse, String activityId) {
        BoardActivityAttachment__c boardActivityAttachment = getBoardActivityAttachmentByFilePath(uploadResponse.path_display);
        if (boardActivityAttachment == null || boardActivityAttachment.BoardActivity__c == activityId) return;

        BoardActivityAttachment__c clonedAttachment = boardActivityAttachment.clone(
                false,
                true,
                true,
                false);
        clonedAttachment.BoardActivity__c = activityId;
        insert clonedAttachment;
    }

    private static BoardActivityAttachment__c getBoardActivityAttachmentByFilePath(String filePath) {
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

    class FileUploadResponse {
        public String name;
        public String path_display;
        public String id;
    }

    class FileSharingResponse {
        public String name;
        public String url;
        public String id;
    }

    public class InsertException extends Exception {
    }
}