({
    handleMessage: function (component, message) {
        var recordId;
        var service;

        if (message && message.getParam('recordId')) {
            // Retrieve LMS message parameter
            recordId = message.getParam('recordId');
            component.set('v.contactId', recordId);

            // Refresh record from data service
            service = component.find('service');
            service.reloadRecord();
        } else {
            component.set('v.contactId', '');
        }
    }
});
