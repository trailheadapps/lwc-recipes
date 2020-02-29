({
    doInit: function(component, event) {
        const action = component.get('c.getAccountsWithContacts');
        action.setCallback(this, function(response) {
            if (response.getState() === 'SUCCESS') {
                component.set('v.accounts', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    handleClick: function(component, event) {
        console.dir(event.target.dataset.id);
        const accountId = event.target.dataset.id;

        let payload = { recordId: accountId };

        component.find('recordSelected').publish(payload);
    }
});
