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


    @AuraEnabled(cacheable=true)
    public static List<UserRole> getUserRoles(){
        List<UserRole> userRoles;
        try {
            userRoles = [SELECT Id,Name FROM UserRole];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return userRoles;
    }

    @AuraEnabled
    public static List<User> searchUsers(Id profileId,Id roleId, String name){
        List<User> userResult;
        System.debug('UUUUUUUUUUUUUUUUUUUU ' + profileId + 'ssss ' + roleId + 'Name ' + name );

        // if(profileId == NULL && roleId == NULL && name == NULL){
        //     return NULL;
        // }

        try {
            String query = 'SELECT Id,Name FROM User WHERE Id != NULL ';    
            if(profileId != NULL){
                query += 'AND ProfileId = :profileId ';
            }
            if(roleId != null){
                query += 'AND UserRoleId =:roleId ';
            }
            if(!String.isEmpty(name)){
                query += 'AND Name LIKE \'%' +  String.escapeSingleQuotes(name) + '%\'';
            }
            System.debug('qqqqqqqqqqqq ' +query);
            userResult =  Database.query(query);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        
        System.debug('ddddddddddd ' + userResult);
        return userResult;
    }

}
