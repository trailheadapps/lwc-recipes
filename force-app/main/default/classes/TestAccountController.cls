@isTest
public class TestAccountController {
    public static void createAccounts(Integer amount) {
        List<Account> accounts = new List<Account>();

        for (Integer i = 1; i <= amount; i++) {
            accounts.add(new Account(Name = 'Name ' + i));
        }

        insert accounts;
    }

    @isTest
    static void getAccountList() {
        TestAccountController.createAccounts(10);

        Test.startTest();
        List<Account> accts = AccountController.getAccountList();
        Test.stopTest();

        Assert.areEqual(10, accts.size());
    }

    @isTest
    static void getSingleAccount() {
        TestAccountController.createAccounts(1);

        Test.startTest();
        Account acc = AccountController.getSingleAccount();
        Test.stopTest();

        Assert.areEqual('Name 1', acc.Name);
    }
}
