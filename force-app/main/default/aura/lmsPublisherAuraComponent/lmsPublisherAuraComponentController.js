// eslint-disable-next-line no-unused-expressions
({
    doInit: function (component) {
        var action = component.get('c.getContactList');

        action.setCallback(this, function (response) {
            if (response.getState() === 'SUCCESS') {
                component.set('v.contacts', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    handleContactSelect: function (component, event) {
        var payload = { recordId: event.target.contact.Id };

        // Publish LMS message with payload
        component.find('recordSelected').publish(payload);
    }
});
