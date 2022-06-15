public with sharing class DropBoxApi {
    private static DropBoxApiService dropBoxApiService = new DropBoxApiService();

    @AuraEnabled
    public static Boolean uploadFile(String activityId, String fileName, String bodyBase64) {
        try {
            return dropBoxApiService.uploadFile(activityId, fileName, bodyBase64);
        } catch (Exception ex) {
            System.debug(ex);
            throw new DropBoxApiException(ex);
        }
    }

    public class DropBoxApiException extends Exception {
    }
}