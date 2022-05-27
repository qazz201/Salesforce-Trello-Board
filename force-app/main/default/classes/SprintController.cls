public with sharing class SprintController {

    @AuraEnabled
    public static List<String> getSprintTasks() {
        Schema.DescribeFieldResult fieldResult = Sprint_Task_Status__c.Available_Status__c.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();

        List<String> pickListValuesList = new List<String>();

        for (Schema.PicklistEntry pickListVal : ple) {
            pickListValuesList.add(pickListVal.getLabel());
        }
        return pickListValuesList;
    }

}