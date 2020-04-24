({
    doInit: function (component, event) {
        var action = component.get('c.getAccountsWithContacts');
        action.setCallback(this, function (response) {
            if (response.getState() === 'SUCCESS') {
                component.set('v.accounts', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    handleClick: function (component, event) {
        //console.log(event.target.dataset.id);
        var accountId = event.target.dataset.id;

        var payload = { recordId: accountId };

        component.find('recordSelected').publish(payload);
    }
});
