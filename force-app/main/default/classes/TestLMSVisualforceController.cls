/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an org are executed whenever Apex code is deployed
 * to a production org to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production org. In addition, all triggers must have some code coverage.
 *
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the org size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
private class TestLMSVisualforceController {
    @isTest
    static void testInitialPageRender() {
        LMSVisualforceController controller = new LMSVisualforceController();

        System.assert(
            controller.contactRecord != null,
            'Contact record does not initialize on class instantiation'
        );
        System.assertEquals(
            controller.contactRecord.Id,
            null,
            'Contact Id should not be initialized or have a value'
        );
    }

    @isTest
    static void testRefreshContact() {
        // Set up test data: 1 contact record
        Contact testContact = new Contact(
            FirstName = 'Rebecca',
            LastName = 'Crumpler',
            Title = 'Doctor',
            Phone = '+1-703-555-1883',
            Email = 'rebecca@first.md',
            Picture__c = 'https://url'
        );

        insert testContact;

        // Verify that test data is all ready to go
        System.assertNotEquals(
            testContact.Id,
            null,
            'Test failed to setup correctly, test record does not have an Id after save.'
        );

        // Set current page for test
        PageReference pageReference = Page.lmsSubscriberVisualforcePostbackAction;
        Test.setCurrentPage(pageReference);

        // Set up page state: controller instantiated and Id parameter set to a Contact Id
        LMSVisualforceController controller = new LMSVisualforceController();
        ApexPages.currentPage().getParameters().put('Id', testContact.Id);

        // Test apex method invoked by action function
        Test.startTest();
        controller.refreshContact();
        Test.stopTest();

        // Simulate name as retrieved via the Contact.Name field
        String testContactName =
            testContact.FirstName +
            ' ' +
            testContact.LastName;

        // Verify matching record values when retrieved via the controller
        System.assertEquals(
            testContact.Id,
            controller.contactRecord.Id,
            'testContact.Id does not match controller.contactRecord.Id'
        );
        System.assertEquals(
            testContactName,
            controller.contactRecord.Name,
            'testContact.Name does not match controller.contactRecord.Name'
        );
        System.assertEquals(
            testContact.Title,
            controller.contactRecord.Title,
            'testContact.Title does not match controller.contactRecord.Title'
        );
        System.assertEquals(
            testContact.Phone,
            controller.contactRecord.Phone,
            'testContact.Phone does not match controller.contactRecord.Phone'
        );
        System.assertEquals(
            testContact.Email,
            controller.contactRecord.Email,
            'testContact.Email does not match controller.contactRecord.Email'
        );
        System.assertEquals(
            testContact.Picture__c,
            controller.contactRecord.Picture__c,
            'testContact.Picture__c does not match controller.contactRecord.Picture__c'
        );
    }
}
