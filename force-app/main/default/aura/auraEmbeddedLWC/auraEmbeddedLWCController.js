({
    handleContactSelect: function (component, event) {
        var service = component.find('service');

        component.set('v.contactId', event.getParam('contactId'));
        service.reloadRecord();
    }
});
