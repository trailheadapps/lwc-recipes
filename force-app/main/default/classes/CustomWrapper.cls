/**
 * Wrapper class used to demonstrate how we can pass complex paramters from LWC.
 * Note that inner classes are not supported when exchanging with LWC.
 */
public with sharing class CustomWrapper {
    @AuraEnabled
    public Integer someInteger { get; set; }
    @AuraEnabled
    public String someString { get; set; }
    @AuraEnabled
    public List<String> someList { get; set; }
}
