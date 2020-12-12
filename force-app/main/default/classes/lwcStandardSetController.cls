public class lwcStandardSetController {
    public static ApexPages.StandardSetController setCon {
        get {
            if(setCon == null) {
                setCon = new ApexPages.StandardSetController(Database.getQueryLocator(
                    [SELECT Id, Name FROM Account]));
            }
            return setCon;
        }
        set;
    }
    @AuraEnabled
    // Initialize setCon and return a list of records
    public static List<Account> getAccountList(List<string> Fields) {
        return (List<Account>) setCon.getRecords();
    }
  
    
}