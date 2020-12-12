public class ContentDocumentLinkHandler {
    public static void UpdateContentVerison(List<ContentDocumentLink> lstCntLinks){
        String strObjPrefix;
        map<Id, Opportunity> mapOpp;
        map<string,string> mapContDocAndOpp = new map<string,string>();
        map<string,Boolean> mapOpptyStatus = new map<string,Boolean>();
        
        for(ContentDocumentLink objConDocLink : lstCntLinks) {
            strObjPrefix = String.valueOf(objConDocLink.LinkedEntityId).substring(0, 3);
            if(strObjPrefix == Opportunity.sObjectType.getDescribe().getKeyPrefix()) {
                mapContDocAndOpp.put(objConDocLink.ContentDocumentId,objConDocLink.LinkedEntityId);
            }
        }
        if(!mapContDocAndOpp.isEmpty()) {
            mapOpp = new map<Id, Opportunity>([SELECT Id, Bulk__c FROM Opportunity WHERE Id IN :mapContDocAndOpp.values()]);//mapvalues
            for(Opportunity objOpp: mapOpp.values()){
                mapOpptyStatus.put(objOpp.Id,objOpp.Bulk__c);
            }
        }
        
        if(!mapOpptyStatus.isEmpty()){
            map<Id, ContentVersion> mapContentVersion = new map<Id, ContentVersion>([select Id, title,Package_Upload_Status__c, ContentDocumentId from ContentVersion where ContentDocumentId IN: mapContDocAndOpp.keyset()]);
            for(ContentVersion cv: mapContentVersion.values()){
                if(mapContDocAndOpp.containsKey(cv.ContentDocumentId)){
                    string OpptyId = mapContDocAndOpp.get(cv.ContentDocumentId);
                    if(mapOpptyStatus.containsKey(OpptyId) && mapOpptyStatus.get(OpptyId)){
                        if(cv.Package_Upload_Status__c!='Ready'){
                            cv.Package_Upload_Status__c = 'Ready';
                        }     
                    }
                }
            }
            if(mapContentVersion.values().size() > 0){
                update mapContentVersion.values();
            }
        }
    }
    
    
  /*  public static void UpdateContentVerison1(List<ContentDocument> lstCntDoc){
        boolean once = true;
        if(once){
            once = false;
            
            String strObjPrefix;
            Set<Id> setCntDocIds = new set<Id>();
            map<Id, Opportunity> mapOpp;
            map<string,string> mapContDocAndOpp = new map<string,string>();
            map<string,Boolean> mapOpptyStatus = new map<string,Boolean>();
            
            for(ContentDocument objConDoc : lstCntDoc) {
                setCntDocIds.add(objConDoc.Id);
            }
            List<ContentDocumentLink> lstCntLinks = [Select Id, LinkedEntityId,
                                                     ContentDocumentId FROM ContentDocumentLink 
                                                     WHERE ContentDocumentId IN :setCntDocIds];
            for(ContentDocumentLink objConDocLink : lstCntLinks) {
                strObjPrefix = String.valueOf(objConDocLink.LinkedEntityId).substring(0, 3);
                if(strObjPrefix == Opportunity.sObjectType.getDescribe().getKeyPrefix()) {
                    mapContDocAndOpp.put(objConDocLink.ContentDocumentId,objConDocLink.LinkedEntityId);
                }
            }
            if(!mapContDocAndOpp.isEmpty()) {
                mapOpp = new map<Id, Opportunity>([SELECT Id, Bulk__c FROM Opportunity WHERE Id IN :mapContDocAndOpp.values()]);//mapvalues
                for(Opportunity objOpp: mapOpp.values()){
                    mapOpptyStatus.put(objOpp.Id,objOpp.Bulk__c);
                }
            }
            
            if(!mapOpptyStatus.isEmpty()){
                map<Id, ContentVersion> mapContentVersion = new map<Id, ContentVersion>([select Id, title,Package_Upload_Status__c, ContentDocumentId from ContentVersion where ContentDocumentId IN: mapContDocAndOpp.keyset()]);
                for(ContentVersion cv: mapContentVersion.values()){
                    if(mapContDocAndOpp.containsKey(cv.ContentDocumentId)){
                        string OpptyId = mapContDocAndOpp.get(cv.ContentDocumentId);
                        if(mapOpptyStatus.containsKey(OpptyId) && mapOpptyStatus.get(OpptyId)){
                            if(cv.Package_Upload_Status__c!='Ready'){
                                cv.Package_Upload_Status__c = 'Ready';
                            }     
                        }
                    }
                }
                if(mapContentVersion.values().size() > 0){
                    update mapContentVersion.values();
                }
            }
        }
    } */   
    
}