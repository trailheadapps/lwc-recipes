@IsTest
public class TestAttachmentHandler_Test{
    static testMethod void testMethodFiles(){
        Account acc = new Account();
        acc.Name = 'Test Account';
        insert acc;
        
        Opportunity oppt = new Opportunity(Name ='New mAWS Deal',
                                           AccountID = acc.Id,
                                           Bulk__c=true,
                                           StageName = 'Customer Won',
                                           Amount = 3000,
                                           CloseDate = System.today()
                                          );
        insert oppt;
        
        ContentVersion cv = new ContentVersion();
        cv.title = 'test content trigger';      
        cv.PathOnClient ='test'; 
        cv.Package_Upload_status__c='';
        cv.VersionData =Blob.valueOf('Test Content'); 
        cv.FirstPublishLocationId =  oppt.Id; 
        insert cv;         
    }
}