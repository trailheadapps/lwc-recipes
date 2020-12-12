({
    displayPopup : function(component, event, helper) {
        var listValues = event.currentTarget.id;
        console.log('test'+listValues);
        document.getElementById(listValues+'contact').style.display="";
    },
    handleSubmit: function(component, event, helper) {
       
        component.find('myRecordForm').submit();
    },
    hidePopup : function(component, event, helper) {
        var listValues = event.currentTarget.id;
                console.log('test'+listValues);

        document.getElementById(listValues+"contact").style.display="none";
    },
    doInit: function(component, event, helper) {
        var action = component.get('c.getContactList');//Call server side method to get records for the data table
        action.setCallback(this,function(response){
            var state = response.getState();
            if(state == 'SUCCESS'){
                var records = response.getReturnValue();
              
                component.set('v.contactList',records);
            }
        });
        $A.enqueueAction(action);
    }
})