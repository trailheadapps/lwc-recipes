public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountList() {
        return [SELECT Id, Name FROM Account WITH SECURITY_ENFORCED LIMIT 10];
    }

    @AuraEnabled(cacheable=true)
    public static Account getSingleAccount() {
        return [
            SELECT Id, Name, Phone, Type
            FROM Account
            WITH SECURITY_ENFORCED
            LIMIT 1
        ];
    }

    // get accounts that have at least one child contact
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountsWithContacts() {
        return [
            SELECT Id, Name
            FROM Account
            WHERE Id IN (SELECT AccountId FROM Contact WHERE AccountId != null)
            WITH SECURITY_ENFORCED
        ];
    }
}
