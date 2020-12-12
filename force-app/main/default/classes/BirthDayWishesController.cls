public class BirthDayWishesController {
    //This method check for birthday with today's date. If condition get matched then it retues the true.
    @AuraEnabled
    public static boolean wishTheBirthDay(){
        User currentLoggedinUser = [Select id,dob__c from User Where Id =: UserInfo.getUserId() ];
        
	if( currentLoggedinUser.dob__c!= null ){
            if( Date.today().Day() == currentLoggedinUser.dob__c.Day() &&
               Date.today().Month() == currentLoggedinUser.dob__c.Month()){
                   return true;
               }
        }
        return false;
    }
}