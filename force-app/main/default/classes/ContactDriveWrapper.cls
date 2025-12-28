public class ContactDriveWrapper {
    @AuraEnabled public String recordId;
    @AuraEnabled public String firstName;
    @AuraEnabled public String lastName;
    @AuraEnabled public String email;
    @AuraEnabled public String phone;
    @AuraEnabled public Datetime createdDate;
}