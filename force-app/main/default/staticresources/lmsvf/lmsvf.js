var lmsutil = window.lmsutil; 

if (lmsutil === undefined) {
    lmsutil = {};
}

lmsutil.lmsChannelSubscription; 

// Function to generate li elements from contact remote object record
lmsutil.constructContactListItem = function(item){
    var nodeString = `
        <li data-id="${item.get('Id')}">
            <a href="#">
                <div class="slds-grid slds-grid_vertical-align-center">
                    <div class="slds-p-around_small">
                        <img class="img-thumb" src="${item.get('Picture__c')}">
                    </div>
                    <div class="slds-p-around_small">
                        ${item.get('Name')}
                    </div>
                </div>
            </a
        </li>
    `;

    return nodeString.trim(); 
}

// Function to generate detail DOM for contact remote object record
lmsutil.constructContactCardBody = function(contact){
    var nodeString = `
        <div class="slds-m-around_medium">
            <img src="${contact.get('Picture__c')}" class="img-small" alt="Profile photo">
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
}

// LMS Message Publisher handler: this publishes to the message service
lmsutil.handleContactSelected = function(event){
    const selectedIdNode = event.path.find( item => item.dataset.id )

    var payload = { recordId: selectedIdNode.dataset.id }; 
    sforce.one.publish(lmsutil.messageChannel, payload); 
}

// util function to assign handler to list of items
lmsutil.addPublisherListener = function(items, handler){

    items.forEach( item => {
        item.addEventListener('click', handler);
    });
}

// hadnler for RemoteObject query for Contacts on publisher page
lmsutil.handleRemoteContactsCallback = function(err, records){
    if (err) {
        console.error(err);
        return
    }

    var ul = document.querySelector('ul[data-list]');
    
    var liList = records
                    .map( item => lmsutil.constructContactListItem(item) )
                    .join('');

    ul.innerHTML = liList; 

    lmsutil.addPublisherListener(ul.querySelectorAll('li'), lmsutil.handleContactSelected);
}

// LMS Message Handler for lmsSubscriberVisualforceRemoting page
lmsutil.handleLMSMessageRemoting = function(message){
    var contactModel = new SObjectModel.Contact();
    
    contactModel.retrieve(
        {
            where : {
                Id: { eq: message.recordId }
            }
        },
        function(err, records){
            var [contact] = records;
            
            var contactDiv = document.querySelector('div[data-contact]');
            contactDiv.innerHTML = lmsutil.constructContactCardBody(contact);
        }
        );
    }
    
// LMS Message Handler for lmsSubscriberVisualforcePostbackAction page
lmsutil.handleLMSMessagePostback = function(message){
    lmsutil.actionFunction(message.recordId);
}

// Util function to subscribe to LMS message channels
lmsutil.subscribeToMessageChannel = function(channel, handler) { 
    if (!lmsutil.lmsChannelSubscription) { 
        lmsutil.lmsChannelSubscription = sforce.one.subscribe(channel, handler, {scope: "APPLICATION"}); 
    }
} 

// Init functions for each page. 
// By naming them for each page, we can invoke implicitly based on $CurrentPage.Name global variable
lmsutil.initFunctions = {};

lmsutil.initFunctions.lmsSubscriberVisualforcePostbackAction = function(event){
        lmsutil.subscribeToMessageChannel(lmsutil.messageChannel, lmsutil.handleLMSMessagePostback);
}

lmsutil.initFunctions.lmsSubscriberVisualforceRemoting = function(event){
        lmsutil.subscribeToMessageChannel(lmsutil.messageChannel, lmsutil.handleLMSMessageRemoting);
}

lmsutil.initFunctions.lmsPublisherVisualforce = function(event){
        var contactModel = new SObjectModel.Contact();

        contactModel.retrieve(
            {
                limit: 10
            },
            lmsutil.handleRemoteContactsCallback
        );
}

// Init lmsutil for each page and wire up LMS features accordingly
lmsutil.init = function(event){
    if (event.target.readyState === 'complete'){

        // Invoke init for current page using this library
        lmsutil.initFunctions[lmsutil.currentPage](event);
        
    }
}

// Wire up init to page readystatechange event
document.addEventListener('readystatechange', lmsutil.init);