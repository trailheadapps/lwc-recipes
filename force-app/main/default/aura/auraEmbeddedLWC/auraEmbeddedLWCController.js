// eslint-disable-next-line no-unused-expressions
({
    handleContactSelect: function (component, event) {
        var service = component.find('service');

        component.set('v.contactId', event.getParam('contactId'));
        service.reloadRecord();
    }
});
