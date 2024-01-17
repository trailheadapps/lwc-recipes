public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountList() {
        return [SELECT Id, Name FROM Account WITH USER_MODE LIMIT 10];
    }

    @AuraEnabled(cacheable=true)
    public static Integer getTotalNumber() {
        return [SELECT COUNT() FROM Account WITH USER_MODE];
    }

    @AuraEnabled(cacheable=true)
    public static Account getSingleAccount() {
        return [
            SELECT Id, Name, Phone, Type
            FROM Account
            WITH USER_MODE
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
                WITH USER_MODE
                LIMIT 1
            ];
            acc.NumberOfEmployees = Integer.valueof((Math.random() * 100000));
            update as user acc;
        } catch (Exception e) {
            throw new AccountUpdateException(
                'Couldn\'t update account with ID ' + accountId
            );
        }
    }

    public class AccountUpdateException extends Exception {
    }
}
