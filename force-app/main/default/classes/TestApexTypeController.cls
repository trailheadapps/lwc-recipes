@isTest
public with sharing class TestApexTypeController {
    @isTest
    static void checkApexTypes() {
        CustomWrapper wrapper = new CustomWrapper();
        wrapper.someInteger = 33;
        wrapper.someString = 'someMockString';
        wrapper.someList = new List<String>();

        Test.startTest();
        String result = ApexTypesController.checkApexTypes(wrapper);
        Test.stopTest();

        System.assertEquals(
            'You entered "someMockString" as String, and "33" as Integer value. The list contained 0 items.',
            result,
            'checkApexTypes doesn\'t return the expected string'
        );
    }
}
