({
	doInit: function(component, event, helper) {
        // Fetch the Contact list from the Apex controller
        helper.getAccountList(component);
    },
    handleMouseHover: function(component, event, helper) {
        var my = event.srcElement.id;
        component.set("v.reId",my);
        helper.getMiniLayout(component, event, helper)
    },
    handleMouseOut: function(component, event, helper) {
        component.set("v.hoverRow",-1);
        component.set("v.togglehover",false);
    }
})