/* eslint-disable no-console */
import { LightningElement, wire } from 'lwc';
import getContactsByAccountId from '@salesforce/apex/ContactController.getContactsByAccountId';
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';
import recordSelected from '@salesforce/messageChannel/recordSelected__c';

export default class LmsSubscriberWebComponent extends LightningElement {
    subscription = null;
    accountId;

    @wire(getContactsByAccountId, { accountId: '$accountId' })
    contacts;

    @wire(MessageContext)
    messageContext;

    handleSubscribeMC(event) {
        console.dir(event);

        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                recordSelected,
                message => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    handleUnsubscribeMC(event) {
        console.dir(event);
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    handleMessage(message) {
        console.log(`lwc component got record Id: ${message.recordId}`);
        this.accountId = message.recordId;
    }
}
