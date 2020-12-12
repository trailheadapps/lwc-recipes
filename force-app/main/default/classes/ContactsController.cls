public class ContactsController {
    @AuraEnabled
    public static List <contact> getContacts() {
        return [SELECT Id, name,phone, Contact.account.Name, Contact.account.industry, Contact.account.Type,
                Contact.account.Phone  FROM contact ORDER BY createdDate ASC];
    }
}