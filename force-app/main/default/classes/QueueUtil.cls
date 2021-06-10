public with sharing class QueueUtil {

    @AuraEnabled(cacheable=true)
    public static List<Group> getQueues(){
        List<Group> queues;
        try {
            queues = [SELECT Id,Name FROM Group WHERE Type='Queue'];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

        return queues;
    }
}
