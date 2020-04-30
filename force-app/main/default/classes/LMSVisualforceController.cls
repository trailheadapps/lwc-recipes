public with sharing class LMSVisualforceController {
    // Class to support Visualforce pages used in Lightning Message Service recipes
    public List<Contact> contacts { get; set; }
    public Boolean showList {
        get {
            return contacts.size() > 1;
        }
    }

    public LMSVisualforceController() {
        contacts = new List<Contact>();
    }

    public PageReference refreshContacts() {
        Id accountId = ApexPages.currentPage().getParameters().get('acctId');
        this.contacts = ContactController.getContactsByAccountId(accountId);
        return null;
    }

    @RemoteAction
    public static List<Contact> getContactsByAccountId(String accountId) {
        return ContactController.getContactsByAccountId(accountId);
    }

    @RemoteAction
    public static List<Account> getAccountsWithContacts() {
        return AccountController.getAccountsWithContacts();
    }

    @RemoteAction
    public static List<Contact> getContactList() {
        return ContactController.getContactList();
    }
}
