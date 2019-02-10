({
    handleContactSelect: function(component, event) {
        component.set('v.contactId', event.getParam('contactId'));
        var service = component.find('service');
        service.reloadRecord();
    }
});
