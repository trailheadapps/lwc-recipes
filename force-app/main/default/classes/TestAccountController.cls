@isTest
public class TestAccountController {
    public static List<Account> createAccounts(Integer amount) {
        List<Account> accounts = new List<Account>();

        for (Integer i = 1; i <= amount; i++) {
            accounts.add(new Account(Name = 'Name ' + i));
        }

        insert accounts;
        return accounts;
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
    static void getTotalNumber_returnsCount() {
        TestAccountController.createAccounts(10);

        Test.startTest();
        Integer accountNumber = AccountController.getTotalNumber();
        Test.stopTest();

        Assert.areEqual(10, accountNumber);
    }

    @isTest
    static void getSingleAccount() {
        TestAccountController.createAccounts(1);

        Test.startTest();
        Account acc = AccountController.getSingleAccount();
        Test.stopTest();

        Assert.areEqual('Name 1', acc.Name);
    }

    @isTest
    static void randomizeAccountData_works() {
        Account acc = TestAccountController.createAccounts(1)[0];
        Integer originalEmployeeCount = acc.NumberOfEmployees;

        Test.startTest();
        AccountController.randomizeAccountData(acc.Id);
        Test.stopTest();

        acc = [
            SELECT Id, NumberOfEmployees
            FROM Account
            WHERE Id = :acc.Id
            LIMIT 1
        ];
        Assert.areNotEqual(originalEmployeeCount, acc.NumberOfEmployees);
    }

    @isTest
    static void randomizeAccountData_failsWithInvalidId() {
        try {
            AccountController.randomizeAccountData(null);
            Assert.fail('Expected an AccountUpdateException');
        } catch (Exception e) {
            Assert.isInstanceOfType(
                e,
                AccountController.AccountUpdateException.class,
                'Expected an instance of AccountUpdateException'
            );
        }
    }
}
