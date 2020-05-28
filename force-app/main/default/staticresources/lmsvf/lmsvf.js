'use strict';

var lmsUtil = window.lmsUtil;

if (lmsUtil === undefined) {
    lmsUtil = {};
}

lmsUtil.lmsChannelSubscription;

// Function to generate li elements from contact remote object record
lmsUtil.constructContactListItem = function (item) {
    var nodeString = `
        <li data-id="${item.get('Id')}">
            <a href="#">
                <div class="slds-grid slds-grid_vertical-align-center">
                    <div>
                        <img class="img-thumb" src="${item.get('Picture__c')}">
                    </div>
                    <div class="slds-var-p-around_small">
                        ${item.get('Name')}
                    </div>
                </div>
            </a
        </li>
    `;

    return nodeString;
};

// Function to generate detail DOM for contact remote object record
lmsUtil.constructContactCardBody = function (contact) {
    var nodeString = `
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

// LMS Message Publisher handler: this publishes to the message service
lmsUtil.handleContactSelected = function (event) {
    const selectedIdNode = event.path.find((item) => item.dataset.id);

    var payload = { recordId: selectedIdNode.dataset.id };
    sforce.one.publish(lmsUtil.messageChannel, payload);
};

// Util function to assign handler to list of items
lmsUtil.addPublisherListener = function (items, handler) {
    items.forEach((item) => {
        item.addEventListener('click', handler);
    });
};

// Handler for RemoteObject query for Contacts on publisher page
lmsUtil.handleRemoteContactsCallback = function (err, records) {
    if (err) {
        console.error(err);
        return;
    }

    var ul = document.querySelector('ul[data-list]');

    var liList = records
        .map((item) => lmsUtil.constructContactListItem(item))
        .join('');

    ul.innerHTML = liList;

    lmsUtil.addPublisherListener(
        ul.querySelectorAll('li'),
        lmsUtil.handleContactSelected
    );
};

// LMS Message Handler for lmsSubscriberVisualforceRemoting page
lmsUtil.handleLMSMessageRemoting = function (message) {
    var contactModel = new SObjectModel.Contact();

    contactModel.retrieve(
        {
            where: {
                Id: { eq: message.recordId }
            }
        },
        function (err, records) {
            var [contact] = records;

            var contactDiv = document.querySelector('div[data-contact]');
            contactDiv.innerHTML = lmsUtil.constructContactCardBody(contact);
        }
    );
};

// LMS Message Handler for lmsSubscriberVisualforcePostbackAction page
lmsUtil.handleLMSMessagePostback = function (message) {
    lmsUtil.actionFunction(message.recordId);
};

// Util function to subscribe to LMS message channels
lmsUtil.subscribeToMessageChannel = function (channel, handler) {
    if (!lmsUtil.lmsChannelSubscription) {
        lmsUtil.lmsChannelSubscription = sforce.one.subscribe(
            channel,
            handler,
            { scope: 'APPLICATION' }
        );
    }
};

// Init functions for each page.
// By naming them for each page, we can invoke implicitly based on $CurrentPage.Name global variable
lmsUtil.initFunctions = {};

lmsUtil.initFunctions.lmsSubscriberVisualforcePostbackAction = function (
    event
) {
    lmsUtil.subscribeToMessageChannel(
        lmsUtil.messageChannel,
        lmsUtil.handleLMSMessagePostback
    );
};

lmsUtil.initFunctions.lmsSubscriberVisualforceRemoting = function (event) {
    lmsUtil.subscribeToMessageChannel(
        lmsUtil.messageChannel,
        lmsUtil.handleLMSMessageRemoting
    );
};

lmsUtil.initFunctions.lmsPublisherVisualforce = function (event) {
    var contactModel = new SObjectModel.Contact();

    contactModel.retrieve(
        {
            limit: 10
        },
        lmsUtil.handleRemoteContactsCallback
    );
};

// Init lmsUtil for each page and wire up LMS features accordingly
lmsUtil.init = function (event) {
    if (event.target.readyState === 'complete') {
        // Invoke init for current page using this library
        lmsUtil.initFunctions[lmsUtil.currentPage](event);
    }
};

// Wire up init to page readystatechange event
document.addEventListener('readystatechange', lmsUtil.init);
