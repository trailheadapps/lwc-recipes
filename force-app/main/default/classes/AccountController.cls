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

    @AuraEnabled
    public static void randomizeAccountData(Id accountId) {
        try {
            Account acc = [
                SELECT Id, NumberOfEmployees
                FROM Account
                WHERE Id = :accountId
                LIMIT 1
            ];
            acc.NumberOfEmployees = Integer.valueof((Math.random() * 100000));
            update acc;
        } catch (Exception e) {
            throw new AccountUpdateException(
                'Couldn\'t update account with ID ' + accountId
            );
        }
    }

    public class AccountUpdateException extends Exception {
    }
}
