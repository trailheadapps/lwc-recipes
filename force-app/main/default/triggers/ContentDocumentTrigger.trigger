trigger ContentDocumentTrigger on ContentDocument (before update) {
    for(ContentDocument obj: trigger.new){
        if(obj.LatestPublishedVersionId != trigger.oldmap.get(obj.Id).LatestPublishedVersionId){
           // obj.addError('u cannot upload new version');
        }
    }
}