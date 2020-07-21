public with sharing class ExamScoreCalculatorController {
    @AuraEnabled
    public static list<Score__c> getScoreList() {
        return [
            SELECT Id, Name, Result__c
            FROM Score__c
            WHERE Result__c != null
            LIMIT 10
        ];
    }
}