({
	doInit: function(component, event, helper) {
        let refreshing = component.get('v.refreshing');
        
        if (!refreshing) {
            const refreshInterval = component.get('v.refreshInterval');
            const intervalId = window.setInterval(() => {
               // helper.refreshListView(component);
                 $A.get('e.force:refreshView').fire();


            }, refreshInterval * 1000);
                component.set('v.intervalId', intervalId);
                component.set('v.refreshing', true);
            }
                else {
                const intervalId = component.get('v.intervalId');
                window.clearInterval(intervalId);
                component.set('v.intervalId', null);
                component.set('v.refreshing', false);
            }
   }
})