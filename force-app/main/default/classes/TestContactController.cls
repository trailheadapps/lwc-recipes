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
    static void getContactError() {
        AuraHandledException testError;
        String ERROR_MESSAGE = 'This is a custom Apex-generated error message.';
        Test.startTest();
        try {
            ContactController.getContactError();
        } catch (AuraHandledException e) {
            testError = e;
        }
        Test.stopTest();

        System.debug(testError);
        System.assertEquals(
            ERROR_MESSAGE,
            testError.getMessage(),
            'The expected error message was not received.'
        );
    }
}
