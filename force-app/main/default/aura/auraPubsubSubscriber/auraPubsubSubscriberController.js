({
    handlePubsubReady: function (component) {
        var pubsub = component.find('pubsub');
        var callback = $A.getCallback(function (contactId) {
            var service = component.find('service');

            component.set('v.contactId', contactId);

            service.reloadRecord();
        });

        pubsub.registerListener('contactSelected', callback);
    },

    handleDestroy: function (component) {
        var pubsub = component.find('pubsub');

        pubsub.unregisterAllListeners();
    }
});
