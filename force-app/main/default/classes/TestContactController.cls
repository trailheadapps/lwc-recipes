@isTest
public with sharing class TestContactController {


    public static void createContacts(Integer amount) {

        List<Contact> contacts = new List<Contact>();

        for (Integer i=1;i<=amount;i++) {
            contacts.add(
                new Contact(
                    FirstName='First ' + i,
                    LastName='Last ' + i,
                    Picture__c='test'
                    )
                );
        }

        insert contacts;

    }

    @isTest static void getContactList() {

        TestContactController.createContacts(10);

        Test.startTest();
        List<Contact> conts = ContactController.getContactList();
        Test.stopTest();

        System.assertEquals(conts.size(), 10);

    }

   @isTest static void findContacts() {

        TestContactController.createContacts(10);

        Test.startTest();
        List<Contact> conts = ContactController.findContacts('Last');
        Test.stopTest();

        System.assertEquals(conts.size(), 10);

    }

    @isTest static void getSingleContact() {

        TestContactController.createContacts(1);

        Test.startTest();
        Contact cont = ContactController.getSingleContact();
        Test.stopTest();

        System.assertEquals(cont.Name, 'First 1 Last 1');

    }


}
