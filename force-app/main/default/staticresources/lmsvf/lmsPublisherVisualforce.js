'use strict';

const lmsUtil = window.lmsUtil;

// (do I need this?)
// if (lmsUtil === undefined) {
//     lmsUtil = {};
// }

// Function to generate li elements from contact remote object record
lmsUtil.listItemTemplate = (item) => {
    const nodeString = `
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

// Click handler to invoke sforce.one.publish to publish
// LMS message with payload including the Id of the selected item
lmsUtil.handleContactSelected = (event) => {
    // Get the DOM node that has the data-id tag on it
    const selectedIdNode = event.path.find((item) => item.dataset.id);

    // Set the id value into the payload object and publish to message channel
    const payload = { recordId: selectedIdNode.dataset.id };
    sforce.one.publish(lmsUtil.messageChannel, payload);
};

// Handle remote callback, construct DOM, and assign click handlers
lmsUtil.handleRemoteContactsCallback = (err, records) => {
    if (err) {
        console.error(err);
        return;
    }

    // Get root node for list
    var ul = document.querySelector('ul[data-list]');

    // Construct list items
    var liList = records.map((item) => lmsUtil.listItemTemplate(item)).join('');

    // Attach list items to DOM root
    ul.innerHTML = liList;

    // Attach click handler on each li item
    ul.querySelectorAll('li').forEach((item) => {
        item.addEventListener('click', lmsUtil.handleContactSelected);
    });
};

// On page ready, fetch salesforce data and build list of Contacts
document.addEventListener('readystatechange', (event) => {
    if (event.target.readyState === 'complete') {
        var contactModel = new SObjectModel.Contact();

        contactModel.retrieve(
            {
                limit: 10
            },
            lmsUtil.handleRemoteContactsCallback
        );
    }
});
