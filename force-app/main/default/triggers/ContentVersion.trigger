trigger ContentVersion on ContentVersion (before update) {
    for(ContentVersion obj: trigger.new){
        system.debug(obj);
        system.debug(trigger.old);
    }
}