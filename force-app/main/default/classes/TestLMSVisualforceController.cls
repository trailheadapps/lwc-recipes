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

        Assert.isNotNull(
            controller.contactRecord,
            'Contact should initialize on class instantiation'
        );
        Assert.isNull(
            controller.contactRecord.Id,
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
        Assert.isNotNull(
            testContact.Id,
            'Test failed to setup correctly, test record should have an Id after save.'
        );

        // Set current page for test
        PageReference pageReference = Page.lmsSubscriberVisualforcePostbackAction;
        Test.setCurrentPage(pageReference);

        // Set up page state: controller instantiated and Id parameter set to a Contact Id
        // Calling put() on the map returned by getParameters() assigns a URL parameter
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
        Assert.areEqual(
            testContact.Id,
            controller.contactRecord.Id,
            'actual controller.contactRecord.Id should match expected testContact.Id'
        );
        Assert.areEqual(
            testContactName,
            controller.contactRecord.Name,
            'actual controller.contactRecord.Name should match expected testContactName'
        );
        Assert.areEqual(
            testContact.Title,
            controller.contactRecord.Title,
            'actual controller.contactRecord.Title should match expected testContact.Title'
        );
        Assert.areEqual(
            testContact.Phone,
            controller.contactRecord.Phone,
            'actual controller.contactRecord.Phone should match expected testContact.Phone'
        );
        Assert.areEqual(
            testContact.Email,
            controller.contactRecord.Email,
            'actual controller.contactRecord.Email should match expected testContact.Email'
        );
        Assert.areEqual(
            testContact.Picture__c,
            controller.contactRecord.Picture__c,
            'actual controller.contactRecord.Picture__c should match expected testContact.Picture__c'
        );
    }
}
