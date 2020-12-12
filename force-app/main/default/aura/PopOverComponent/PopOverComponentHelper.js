({
    getAccountList: function(component) {
        var action = component.get('c.getContacts');
        // Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {
            var result = actionResult.getReturnValue();
            component.set('v.contacts', result);
            var conAccList = [];
            for(var i=0 ; i<result.length;i++){
                conAccList.push({"Id":result[i].Id, "value":result[i]});
            }
            component.set('v.conAccLst', conAccList);
        });
        $A.enqueueAction(action);
    },
    //Fetch the releted account on mouseHover 
    getMiniLayout:function(component, event, helper){
        
        var getAccount = component.get('v.conAccLst');
        for(var i=0;i<getAccount.length;i++){
            if(getAccount[i].Id == component.get("v.reId")){
                component.set('v.mouseHoverData', getAccount[i].value.Account);
                break;
            }
        }
        component.set("v.hoverRow", parseInt(event.target.dataset.index));
        component.set("v.togglehover",true);
    }
})