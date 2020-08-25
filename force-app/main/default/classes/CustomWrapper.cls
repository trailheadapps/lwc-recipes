public with sharing class CustomWrapper {
    class InnerWrapper {
        @AuraEnabled
        public Integer someInnerInteger { get; set; }
        @AuraEnabled
        public String someInnerString { get; set; }
    }

    @AuraEnabled
    public Integer someInteger { get; set; }
    @AuraEnabled
    public String someString { get; set; }
    @AuraEnabled
    public List<InnerWrapper> someList { get; set; }
}
