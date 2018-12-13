@isTest
public class TestAccountController {

    public static void createAccounts(Integer amount) {

        List<Account> accounts = new List<Account>();

        for (Integer i=1;i<=amount;i++) {
            accounts.add(
                new Account(
                    Name='Name ' + i
                    )
                );
        }

        insert accounts;

    }

    static testMethod void getAccountList() {

        TestAccountController.createAccounts(10);

        Test.startTest();
        List<Account> accts = AccountController.getAccountList();
        Test.stopTest();

        System.assertEquals(accts.size(), 10);

    }


    static testMethod void getSingleAccount() {

        TestAccountController.createAccounts(1);

        Test.startTest();
        Account acc = AccountController.getSingleAccount();
        Test.stopTest();

        System.assertEquals(acc.Name, 'Name 1');

    }

}
