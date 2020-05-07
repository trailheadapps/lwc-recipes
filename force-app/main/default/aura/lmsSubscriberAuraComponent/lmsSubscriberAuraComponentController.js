({
    handleMessage: function (component, message) {
        if (message && message.getParam('recordId')) {
            var recordId = message.getParam('recordId');
            component.set('v.contactId', recordId);
            var service = component.find('service');
            service.reloadRecord();
        } else {
            component.set('v.contactId', '');
        }
    }
});
