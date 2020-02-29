public with sharing class VFRemotingController {
    // composing these two methods into a single class to act as the single VF page controller

    @RemoteAction
    public static List<Contact> getContactsByAccountId(String accountId) {
        return ContactController.getContactsByAccountId(accountId);
    }

    @RemoteAction
    public static List<Account> getAccountsWithContacts() {
        return AccountController.getAccountsWithContacts();
    }
}
