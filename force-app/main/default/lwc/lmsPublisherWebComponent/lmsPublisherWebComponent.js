import { LightningElement, wire } from 'lwc';
import getAccountsWithContacts from '@salesforce/apex/AccountController.getAccountsWithContacts';
import { publish, MessageContext } from 'lightning/messageService';
import recordSelected from '@salesforce/messageChannel/RecordSelected__c';

export default class LmsPublisherWebComponent extends LightningElement {
    @wire(getAccountsWithContacts)
    accounts;

    @wire(MessageContext)
    messageContext;

    handleClick(event) {
        const payload = { recordId: event.target.dataset.id };

        publish(this.messageContext, recordSelected, payload);
    }
}
