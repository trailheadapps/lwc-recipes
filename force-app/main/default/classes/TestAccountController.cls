@isTest
public class TestAccountController {
    public static void createAccounts(Integer amount) {
        List<Account> accounts = new List<Account>();

        for (Integer i = 1; i <= amount; i++) {
            accounts.add(new Account(Name = 'Name ' + i));
        }

        insert accounts;
    }

    public static void createAccountsWithContacts(
        Integer acctCount,
        Integer acctsWithContacts
    ) {
        System.assert(
            acctCount > acctsWithContacts,
            'This test data set requires ' +
            acctCount +
            ' to be larger than ' +
            acctsWithContacts
        );

        List<Account> accounts = new List<Account>();

        for (Integer i = 1; i <= acctCount; i++) {
            accounts.add(new Account(Name = 'Name ' + i));
        }

        insert accounts;

        List<Contact> contacts = new List<Contact>();
        // create contacts for as many accounts as equals acctsWithContacts
        for (Integer i = 0; i < acctsWithContacts; i++) {
            contacts.add(
                new Contact(
                    LastName = 'Last Name ' + i,
                    Picture__c = 'pic.jpg',
                    AccountId = accounts[i].Id
                )
            );
        }

        insert contacts;
    }

    @isTest
    static void getAccountList() {
        TestAccountController.createAccounts(10);

        Test.startTest();
        List<Account> accts = AccountController.getAccountList();
        Test.stopTest();

        System.assertEquals(accts.size(), 10);
    }

    @isTest
    static void getSingleAccount() {
        TestAccountController.createAccounts(1);

        Test.startTest();
        Account acc = AccountController.getSingleAccount();
        Test.stopTest();

        System.assertEquals(acc.Name, 'Name 1');
    }
}
