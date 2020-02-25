@isTest
public with sharing class TestContactController {
    public static void createContacts(Integer amount) {
        List<Contact> contacts = new List<Contact>();

        for (Integer i = 1; i <= amount; i++) {
            contacts.add(
                new Contact(
                    FirstName = 'First ' + i,
                    LastName = 'Last ' + i,
                    Picture__c = 'test'
                )
            );
        }

        insert contacts;
    }

    @isTest
    static void getContactList() {
        TestContactController.createContacts(10);

        Test.startTest();
        List<Contact> conts = ContactController.getContactList();
        Test.stopTest();

        System.assertEquals(
            10,
            conts.size(),
            'The contact list size should be 10'
        );
    }

    @isTest
    static void findContacts() {
        TestContactController.createContacts(10);

        Test.startTest();
        List<Contact> conts = ContactController.findContacts('Last');
        Test.stopTest();

        System.assertEquals(
            10,
            conts.size(),
            'The contacts retrieved by search should be 10'
        );
    }

    @isTest
    static void getSingleContact() {
        TestContactController.createContacts(1);

        Test.startTest();
        Contact cont = ContactController.getSingleContact();
        Test.stopTest();

        System.assertEquals(
            'First 1 Last 1',
            cont.Name,
            'The contact name should be: First 1 Last 1'
        );
    }

    @isTest
    static void testGetContactsFromAccountId() {
        Integer acctCount = 3;
        Integer acctsWithContacts = 2;

        // reusing the utility method from the TestAccountController test class
        TestAccountController.createAccountsWithContacts(
            acctCount,
            acctsWithContacts
        );

        List<Account> accounts = AccountController.getAccountsWithContacts();

        Test.startTest();
        List<Contact> contacts = ContactController.getContactsByAccountId(
            accounts[0].Id
        );
        Test.stopTest();

        System.assertEquals(
            'Last Name 0',
            contacts[0].Name,
            'The zeroth contact name should be: Last Name 0'
        );
    }
}
