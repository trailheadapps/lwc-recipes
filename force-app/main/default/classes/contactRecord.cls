public class contactRecord{
    @AuraEnabled(cacheable = true) 
    public static list<contact> getContactList(){
        system.debug('test');
        list<contact>  lst = [select id,firstname,lastname,title from contact limit 10];
        system.debug('test'+lst);
        return lst;
    }
    
}