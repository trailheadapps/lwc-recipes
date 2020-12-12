({
    doInit : function(component, event, helper) {
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": "Contact"
        });
        createRecordEvent.fire();
    },
    redirectToNewRecord: function(component, event, helper) {
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": '0012w00000LIg5JAAT',
            "slideDevName": "related"
        });
        navEvt.fire();
        
    }
})