'use strict';
// HTML Template to render after remote call
import { listItemTemplate } from './templates.js';

// To store handles to items in the scope of the page
let _pageConfigs = {};

function setPageConfigs(configs) {
    _pageConfigs = { ...configs };
}

// Click handler to invoke sforce.one.publish to publish
// LMS message with payload including the Id of the selected item
function handleContactSelected(event) {
    // Get the DOM node that has the data-id tag on it
    const selectedIdNode = event.path.find((item) => item.dataset.id);

    // Create LMS message payload
    const payload = { recordId: selectedIdNode.dataset.id };

    // sforce.one.publish passed in from page as _pageConfigs.lmsPublish
    _pageConfigs.lmsPublish(_pageConfigs.messageChannel, payload);
}

// Handle remote callback, construct DOM, and assign click handlers
function handleRemoteContactsCallback(err, records) {
    if (err) {
        console.error(err);
        return;
    }

    // Get root node for list
    var ul = document.querySelector('ul[data-list]');

    // Construct list items
    var liList = records.map((item) => listItemTemplate(item)).join('');

    // Attach list items to DOM root
    ul.innerHTML = liList;

    // Attach click handler on each li item
    ul.querySelectorAll('li').forEach((item) => {
        item.addEventListener('click', handleContactSelected);
    });
}

// On page ready, fetch salesforce data and build list of Contacts
document.addEventListener('readystatechange', (event) => {
    if (event.target.readyState === 'complete') {
        var contactModel = new _pageConfigs.RemoteContact();

        contactModel.retrieve(
            {
                limit: 10
            },
            handleRemoteContactsCallback
        );
    }
});

// Expose function to pass in page objects
export { setPageConfigs };
