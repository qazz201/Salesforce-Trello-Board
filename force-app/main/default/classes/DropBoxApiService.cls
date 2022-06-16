public with sharing class DropBoxApiService {
    @TestVisible
    private static final KanbanBoardSelector kanbanBoardSelector = new KanbanBoardSelector();
    @TestVisible
    private static final String PATH_UPLOAD_FILE = 'callout:DropBoxContent/files/upload';
    @TestVisible
    private static final String PATH_CREATE_SHARED_LINK = 'callout:DropBoxApi/sharing/create_shared_link_with_settings';
    private static final Map<String, Object> uploadFileHeader = new Map<String, Object>{
            'mode' => 'add',
            'autorename' => true,
            'mute' => false,
            'strict_conflict' => false
    };

    /**
    * @description Upload File to DropBox
    * @returns Boolean
    */
    public Boolean uploadFile(String activityId, String fileName, String bodyBase64) {
        try {
            uploadFileHeader.put('path', '/' + fileName);

            String resp = new CalloutClient(PATH_UPLOAD_FILE)
                    .setHeader('Content-Type', 'application/octet-stream')
                    .setHeader('Dropbox-API-Arg', JSON.serialize(uploadFileHeader))
                    .post(EncodingUtil.base64Decode(bodyBase64))
                    .getBody();

            createBoardActivityAttachment((FileUploadResponse) JSON.deserialize(resp, FileUploadResponse.class), activityId);
            return true;
        } catch (Exception ex) {
            System.debug(ex);
            throw new DropBoxApiServiceException(ex);
        }
    }

    private void createBoardActivityAttachment(FileUploadResponse uploadResponse, String activityId) {
        HttpResponse fileSharingResponse = new CalloutClient(PATH_CREATE_SHARED_LINK)
                .setHeader('Content-Type', 'application/json')
                .post(JSON.serialize(new Map<String, Object>{
                        'path' => uploadResponse.path_display
                }));

        // the sharing link already exist
        if (fileSharingResponse.getStatusCode() == 409) {
            Boolean isSuccess = cloneBoardActivityAttachment(uploadResponse, activityId);

            if (isSuccess == true) return;
        }

        FileSharingResponse fileSharing = (FileSharingResponse) JSON.deserialize(fileSharingResponse.getBody(), FileSharingResponse.class);

        insert new BoardActivityAttachment__c(
                BoardActivity__c = activityId,
                DropBoxFileId__c = fileSharing.id,
                DropBoxFilePath__c = uploadResponse.path_display,
                DropBoxFileURL__c = fileSharing.url,
                Name = fileSharing.name);
    }

    private Boolean cloneBoardActivityAttachment(FileUploadResponse uploadResponse, String activityId) {
        BoardActivityAttachment__c boardActivityAttachment = kanbanBoardSelector.getBoardActivityAttachmentByFilePath(uploadResponse.path_display);
        if (boardActivityAttachment == null) return false; //|| boardActivityAttachment.BoardActivity__c == activityId

        BoardActivityAttachment__c clonedAttachment = boardActivityAttachment.clone(
                false,
                true,
                true,
                false);
        clonedAttachment.BoardActivity__c = activityId;
        insert clonedAttachment;

        return true;
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

    public class DropBoxApiServiceException extends Exception {
    }
}