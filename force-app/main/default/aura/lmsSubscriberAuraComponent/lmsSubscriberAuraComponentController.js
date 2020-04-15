({
    handleMessage: function(component, message) {
        if (message && message.getParam('recordId')) {
            console.log(
                'aura component got record id ' + message.getParam('recordId')
            );
            var accountId = message.getParam('recordId');

            var action = component.get('c.getContactsByAccountId');
            action.setParams({ accountId: accountId });
            action.setCallback(this, function(response) {
                var comp = component;
                if (response.getState() === 'SUCCESS') {
                    comp.set('v.contacts', response.getReturnValue());
                }
            });

            $A.enqueueAction(action);
        } else {
            console.error('we got no message or message params');
            component.set('v.contacts', []);
        }
    }
});
