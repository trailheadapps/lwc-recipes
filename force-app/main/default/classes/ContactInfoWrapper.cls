/**
 * Wrapper class for contact information to be passed to Google Drive callout.
 */
public with sharing class ContactInfoWrapper {
    @AuraEnabled
    public String firstName { get; set; }

    @AuraEnabled
    public String lastName { get; set; }

    @AuraEnabled
    public String phone { get; set; }

    @AuraEnabled
    public String email { get; set; }

    @AuraEnabled
    public String address { get; set; }
}