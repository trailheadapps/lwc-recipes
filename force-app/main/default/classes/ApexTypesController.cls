public with sharing class ApexTypesController {

    @AuraEnabled
    public static Boolean checkApexTypes(Settings sett) {
        System.debug(sett);
        return true;
    }

}
