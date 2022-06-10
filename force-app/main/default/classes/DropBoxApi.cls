public with sharing class DropBoxApi {
    private static final String ROOT_PATH = 'callout:DropBoxContent';
    //https://api.dropboxapi.com/2/file_requests/count POST
    private static final Map<String, Object> uploadFileHeader = new Map<String, Object>{
            'mode' => 'add',
            'autorename' => true,
            'mute' => false,
            'strict_conflict' => false
    };


    @AuraEnabled
    public static void uploadFile(String fileName, String body) {
        uploadFileHeader.put('path', '/' + fileName);

        String resp = new CalloutClient('callout:DropBoxContent' + '/files/upload')
                .setHeader('Content-Type', 'application/octet-stream')
                .setHeader('Dropbox-API-Arg', JSON.serialize(uploadFileHeader))
                .post(EncodingUtil.base64Decode(body))
                .getBody();
        System.debug(resp);
    }
}