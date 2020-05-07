({
    handleMessage: function (component, message) {
        if (message && message.getParam('recordId')) {
            // Retreive LMS message parameter
            var recordId = message.getParam('recordId');
            component.set('v.contactId', recordId);
            // Refresh record from data service
            var service = component.find('service');
            service.reloadRecord();
        } else {
            component.set('v.contactId', '');
        }
    }
});
