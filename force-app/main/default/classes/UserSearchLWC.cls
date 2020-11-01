public with sharing class UserSearchLWC {
    public UserSearchLWC() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Profile> getProfiles(){
        List<Profile> profiles;
        try {
            profiles = [SELECT Id,Name FROM Profile];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return profiles;
    }
}
