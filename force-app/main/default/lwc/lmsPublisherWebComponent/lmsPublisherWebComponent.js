import { LightningElement, wire } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';

// Import message service features required for publishing and the message channel
import { publish, MessageContext } from 'lightning/messageService';
import recordSelected from '@salesforce/messageChannel/Record_Selected__c';

export default class LmsPublisherWebComponent extends LightningElement {
    @wire(getContactList)
    contacts;

    @wire(MessageContext)
    messageContext;

    // Respond to UI event by publishing message
    handleContactSelect(event) {
        const payload = { recordId: event.target.contact.Id };

        publish(this.messageContext, recordSelected, payload);
    }
}
