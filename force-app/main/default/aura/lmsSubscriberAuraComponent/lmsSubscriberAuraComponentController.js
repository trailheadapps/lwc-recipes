({
    handleMessage: function(component, event) {
        if (event && event.getParam('recordId')) {
            console.log(
                `aura component got record id ${event.getParam('recordId')}`
            );
            var accountId = event.getParam('recordId');

            var action = component.get('c.getContactsByAccountId');
            action.setParams({ accountId });
            action.setCallback(this, function(response) {
                if (response.getState() === 'SUCCESS') {
                    component.set('v.contacts', response.getReturnValue());
                }
            });

            $A.enqueueAction(action);
        } else {
            console.error('we got no event or event params');
            component.set('v.contacts', []);
        }
    }
});
