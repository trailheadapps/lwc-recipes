public class TestWrapperClass {
    
   public static void getMessg(){
       string response = '{"results":[{"EntityID":"2280262"},{"EntityID":"2280325"},{"EntityID":"3323298"},{"EntityID": "3551732"},{"EntityID":"3304405"}]}}';
       Wrapperclass wrapObj = (Wrapperclass) JSON.deserialize(response, Wrapperclass.class);
       system.debug('test'+wrapObj.results);
       for(results obj: wrapObj.results){
           system.debug('test'+obj.EntityID);
       }
   }
    
    public class WrapperClass {
        public List<Results> results {get;set;} 
    }
    public class Results {
        public String EntityID {get;set;} 
    }
}