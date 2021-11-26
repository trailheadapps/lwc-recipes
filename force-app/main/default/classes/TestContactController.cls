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
    public static void updateContactList() {
        TestContactController.createContacts(2);
        List<Contact> conts = [SELECT Id, FirstName FROM Contact];
        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartArray();
        gen.writeStartObject();
        gen.writeStringField('Id', conts[0].Id);
        gen.writeStringField('FirstName', 'Changed ' + conts[0].FirstName);
        gen.writeEndObject();
        gen.writeStartObject();
        gen.writeStringField('Id', conts[1].Id);
        gen.writeStringField('FirstName', 'Changed ' + conts[1].FirstName);
        gen.writeEndObject();
        gen.writeEndArray();
        String contactsJson = gen.getAsString();

        Test.startTest();
        String response = ContactController.updateContacts(
            JSON.deserializeUntyped(contactsJson)
        );
        Test.stopTest();
        System.assertEquals(
            response,
            'Success: contacts updated successfully',
            'The contact first names should be prefixed with Changed'
        );
    }

    @isTest
    public static void updateContactList_Negative() {
        TestContactController.createContacts(2);
        List<Contact> conts = [SELECT Id, FirstName FROM Contact];
        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartArray();
        gen.writeStartObject();
        gen.writeStringField('Id', conts[0].Id);
        gen.writeStringField('FirstName', 'Changed ' + conts[0].FirstName);
        gen.writeEndObject();
        gen.writeStartObject();
        gen.writeStringField('Id', conts[1].Id);
        gen.writeStringField('FirstName', 'Changed ' + conts[1].FirstName);
        gen.writeEndObject();
        gen.writeEndArray();
        String contactsJson = gen.getAsString();

        //Create Test User
        User u = new User(
            ProfileId = [SELECT Id FROM Profile WHERE Name = 'Standard User']
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

        System.runAs(u) {
            Test.startTest();
            String response = ContactController.updateContacts(
                JSON.deserializeUntyped(contactsJson)
            );
            Test.stopTest();
            System.assertNotEquals(
                response,
                'Success: contacts updated successfully',
                'The updateContacts method fails with exception'
            );
        }
    }
}
