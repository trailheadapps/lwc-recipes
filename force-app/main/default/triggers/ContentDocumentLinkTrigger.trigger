trigger ContentDocumentLinkTrigger on ContentDocumentLink (before insert, after insert) {
    if(trigger.isbefore){
        if(trigger.isInsert){
            for(ContentDocumentLink obj: trigger.new){
               system.debug('test'+obj); 
            }
        }
    }
    if(trigger.isafter){
        if(trigger.isInsert){
           // ContentDocumentLinkHandler.UpdateContentVerison(trigger.new);
        }
    }
    /*public static void UpdateContentVerison2(List<Opportunity> triggerNew, Map<Id, Opportunity> triggerOldMap)
    {
        set<Id> setOppIds = new set<Id>();
        set<Id> setDocumentIds = new set<Id>();
        Id profileId=userInfo.getProfileId();
        string profileName=[SELECT id,Name FROM Profile WHERE id=:profileId LIMIT 1].name;
        if(profileName!='Integration User')
        {
            for(Opportunity opp : triggerNew)
            {
                if((triggerOldMap == null || (triggerOldMap != null && opp.Bulk_Package__c != triggerOldMap.get(opp.Id).Bulk_Package__c && opp.Bulk_Package__c == true)))
                {
                    setOppIds.add(opp.Id);
                }
            }
            if(setOppIds.size()>0)
            {
                List<ContentDocumentLink> contentDocLinks = [SELECT ContentDocumentId  FROM ContentDocumentLink WHERE  LinkedEntityId IN (SELECT Id FROM Opportunity where Id IN: setOppIds) and LinkedEntity.Type='Opportunity'];
                system.debug('testcontentDocLinks '+contentDocLinks);
                for(ContentDocumentLink fileLink: contentDocLinks){
                    setDocumentIds.add(fileLink.ContentDocumentId);
                }
            }
            if(setDocumentIds.size()>0)
            {
                map<Id, ContentVersion> mapContentVersion = new map<Id, ContentVersion>([select Id, title,Package_Upload_Status__c, ContentDocumentId from ContentVersion where ContentDocumentId IN: setDocumentIds]);
                for(ContentVersion cv: mapContentVersion.values())
                {
                    if(cv.Package_Upload_Status__c!='Ready To pick')
                    {
                        cv.Package_Upload_Status__c = 'Ready To pick';
                    }         
                }
                
                if(mapContentVersion.values().size() > 0){
                    update mapContentVersion.values();
                }
            }
        }



    }

            OpportunityTriggerHandler.UpdateContentVerison2(Trigger.new,Trigger.oldMap);



//Create Document
        ContentVersion cv = new ContentVersion();
        cv.Title = 'Test Document';
        cv.PathOnClient = 'TestDocument.pdf';
        cv.VersionData = Blob.valueOf('Test Content');
        cv.IsMajorVersion = true;
        Insert cv;
        
        //Get Content Documents
        Id conDocId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:cv.Id].ContentDocumentId;
        system.debug('conDocId'+conDocId);
        
        //Create ContentDocumentLink 
        ContentDocumentLink cdl = New ContentDocumentLink();
        cdl.LinkedEntityId = oppObj1.Id;
        cdl.ContentDocumentId = conDocId;
        Insert cdl;
        system.debug('conDocId'+cdl);






*/
}