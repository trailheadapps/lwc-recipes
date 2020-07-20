public with sharing class ExamCalculatorController {
    @AuraEnabled
    public static Map<String, Object> saveResult(Map<String, Object> params) {
        Map<String, Object> status = new Map<String, Object>{'__status' => 'error'};
        try {
            Score__c score = new Score__c(
                    Result__c = (Double)params.get('score')
            );
            insert score;
            status = new Map<String, Object>{
                    '__status' => 'success',
                    'scoreId' => score.Id
            };
        } catch (Exception e) {
            status.put('__msg', e.getMessage());
        }
        return status;
    }
}