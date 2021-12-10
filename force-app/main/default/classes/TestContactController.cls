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

    public static User createUser(String profile) {
        //Create Test User
        return new User(
            ProfileId = [SELECT Id FROM Profile WHERE Name = :profile]
            .Id,
            LastName = 'last',
            Email = 'testUser@test.com',
            UserName = 'Test.User' + DateTime.now().getTime() + '@test.com',
            Alias = 'alias',
            TimeZoneSidKey = 'America/Los_Angeles',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US',
            LocaleSidKey = 'en_US'
        );
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
    public static void updateContactList() {
        TestContactController.createContacts(2);
        List<Contact> conts = [SELECT Id, FirstName FROM Contact];
        conts[0].FirstName = 'Changed ' + conts[0].FirstName;
        conts[1].FirstName = 'Changed ' + conts[1].FirstName;

        Test.startTest();
        ContactController.updateContacts(conts);
        List<Contact> updatedConts = [SELECT Id, FirstName FROM Contact];
        Test.stopTest();
        System.assertEquals(
            'Changed First 1',
            updatedConts[0].FirstName,
            'The contact first names should be prefixed with Changed'
        );
    }

    @isTest
    public static void updateContactListNegative() {
        TestContactController.createContacts(2);
        List<Contact> conts = [SELECT Id, FirstName FROM Contact];
        conts[0].FirstName = 'Changed ' + conts[0].FirstName;
        conts[1].FirstName = 'Changed ' + conts[1].FirstName;

        User u1 = createUser('Minimum Access - Salesforce');
        System.runAs(u1) {
            Test.startTest();
            try {
                ContactController.updateContacts(conts);
            } catch (Exception e) {
                String errorMsg = e.getMessage();
                system.assertEquals(
                    errorMsg,
                    'Insufficient permissions to update contacts',
                    'The updateContacts method fails with exception'
                );
            }
            Test.stopTest();
        }

    }
}
