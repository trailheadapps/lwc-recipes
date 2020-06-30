'use strict';
// HTML Template to render after remote call
import { singleItemTemplate } from './templates.js';

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
            handleLMSMessageRemoting
        );
    }
});

// Handle message and use payload to refresh card
function handleLMSMessageRemoting(message) {
    // Get recordId from LMS message payload
    const { recordId } = message;

    // Retrieve record from VF Remote Object API
    const contactModel = new _pageConfigs.RemoteContact();

    contactModel.retrieve(
        {
            where: {
                Id: { eq: recordId }
            }
        },
        (err, records) => {
            const [contact] = records;

            const contactDiv = document.querySelector('div[data-contact]');
            contactDiv.innerHTML = singleItemTemplate(contact);
        }
    );
}

// Expose function to pass in page objects
export { setPageConfigs };
