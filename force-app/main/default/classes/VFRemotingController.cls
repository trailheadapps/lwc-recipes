public with sharing class VFRemotingController {
    // composing these two methods into a single class to act as the single VF page controller
    public List<Contact> contacts { get; set; }
    public Boolean showList {
        get {
            return contacts.size() > 1;
        }
    }

    public VFRemotingController() {
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
}
