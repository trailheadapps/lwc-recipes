({
    handlePubsubReady: function(component) {
        var pubsub = component.find('pubsub');
        var callback = $A.getCallback(function(contactId) {
            component.set('v.contactId', contactId);
            var service = component.find('service');
            service.reloadRecord();
        });
        pubsub.registerListener('contactSelected', callback);
    },

    handleDestroy: function(component) {
        var pubsub = component.find('pubsub');
        pubsub.unregisterAllListeners();
    }
});
