public with sharing class CustomWrapper {
    @AuraEnabled
    public Integer someInteger { get; set; }
    @AuraEnabled
    public String someString { get; set; }
    @AuraEnabled
    public List<Object> someList { get; set; }
}
