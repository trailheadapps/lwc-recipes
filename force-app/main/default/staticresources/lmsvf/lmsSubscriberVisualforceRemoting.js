'use strict';

const lmsUtil = window.lmsUtil;

// if (lmsUtil === undefined) {
//     lmsUtil = {};
// }

lmsUtil.lmsChannelSubscription;

// Function to generate detail DOM for contact remote object record
lmsUtil.singleItemTemplate = function (contact) {
    const nodeString = `
        <div class="slds-var-m-around_medium">
            <img src="${contact.get(
                'Picture__c'
            )}" class="img-small" alt="Profile photo">
        </div>
        <p>${contact.get('Name')}</p>
        <p>${contact.get('Title')}</p>
        <p>
            <a href="tel:${contact.get('Phone')}">${contact.get('Phone')}</a>
        </p>
        <p>
            <a href="mailto:${contact.get('Email')}">${contact.get('Email')}</a>
        </p>
    `;

    return nodeString;
};

// Handle message and use payload to refresh card
lmsUtil.handleLMSMessageRemoting = function (message) {
    // Get recordId from LMS message payload
    const { recordId } = message;

    // Retrieve record from VF Remote Object API
    const contactModel = new SObjectModel.Contact();

    contactModel.retrieve(
        {
            where: {
                Id: { eq: recordId }
            }
        },
        (err, records) => {
            const [contact] = records;

            const contactDiv = document.querySelector('div[data-contact]');
            contactDiv.innerHTML = lmsUtil.singleItemTemplate(contact);
        }
    );
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
            lmsUtil.handleLMSMessageRemoting
        );
    }
});
