({
    doInit: function (component, event) {
        var action = component.get('c.getContactList');
        action.setCallback(this, function (response) {
            if (response.getState() === 'SUCCESS') {
                component.set('v.contacts', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    handleContactSelect: function (component, event) {
        console.log(event.target.contact.Id);

        var payload = { recordId: event.target.contact.Id };

        component.find('recordSelected').publish(payload);
    }
});
