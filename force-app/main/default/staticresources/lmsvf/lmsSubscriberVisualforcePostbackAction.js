'use strict';

// To store handles to items in the scope of the page
let _pageConfigs = {};

function setPageConfigs(configs) {
    _pageConfigs = { ...configs };
}

// LMS Subscription object
let lmsChannelSubscription;

// Invoke sforce.one.subscribe to subscribe to LMS message channel.
function subscribeToMessageChannel(channel, handler) {
    if (!lmsChannelSubscription) {
        lmsChannelSubscription = _pageConfigs.lmsSubscribe(channel, handler);
    }
}

// Subscribe on page load complete
document.addEventListener('readystatechange', (event) => {
    if (event.target.readyState === 'complete') {
        subscribeToMessageChannel(
            _pageConfigs.messageChannel,
            handleLMSMessagePostback
        );
    }
});

// Handle LMS message and invoke action function with payload
function handleLMSMessagePostback(message) {
    // apex:actionFunction passed through from page
    _pageConfigs.actionFunction(message.recordId);
}

// Expose function to pass in page objects
export { setPageConfigs };
