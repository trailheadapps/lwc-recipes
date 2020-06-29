'use strict';

const lmsUtil = window.lmsUtil;

if (lmsUtil === undefined) {
    lmsUtil = {};
}

lmsUtil.lmsChannelSubscription;

// Handle LMS message and invoke action function with payload
lmsUtil.handleLMSMessagePostback = function (message) {
    // apex:actionFunction passed through from page
    lmsUtil.actionFunction(message.recordId);
};

// Invoke sforce.one.subscribe to subscribe to LMS message channel.
lmsUtil.subscribeToMessageChannel = function (channel, handler) {
    if (!lmsUtil.lmsChannelSubscription) {
        lmsUtil.lmsChannelSubscription = sforce.one.subscribe(channel, handler);
    }
};

// Subscribe on page load complete
document.addEventListener('readystatechange', (event) => {
    if (event.target.readyState === 'complete') {
        lmsUtil.subscribeToMessageChannel(
            lmsUtil.messageChannel,
            lmsUtil.handleLMSMessagePostback
        );
    }
});
