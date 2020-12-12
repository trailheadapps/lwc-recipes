@istest
public with sharing class ContactsController_Test {
    @istest
    static void ReferalAccessclassMethod() { 
        Contact c=new Contact(
            FirstName='fname',
            LastName = 'lname',
            Email = 'email@gmail.com',
            Phone = '9743800309'); 
        insert c; 
        contactRecord.getContactList();
    }
   
}