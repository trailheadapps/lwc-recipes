/* eslint-disable no-console */
import { LightningElement, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { reduceErrors } from 'c/ldsUtils';

// message service and message channel
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';
import recordSelected from '@salesforce/messageChannel/Record_Selected__c';

import NAME_FIELD from '@salesforce/schema/Contact.Name';
import TITLE_FIELD from '@salesforce/schema/Contact.Title';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import PICTURE_FIELD from '@salesforce/schema/Contact.Picture__c';

const fields = [
    NAME_FIELD,
    TITLE_FIELD,
    PHONE_FIELD,
    EMAIL_FIELD,
    PICTURE_FIELD
];

export default class LmsSubscriberWebComponent extends LightningElement {
    subscription = null;
    recordId;

    name;
    title;
    phone;
    email;
    picture;

    @wire(getRecord, { recordId: '$recordId', fields })
    wiredRecord({ error, data }) {
        if (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading contact',
                    message: reduceErrors(error).join(', '),
                    variant: 'error'
                })
            );
        } else if (data) {
            this.name = getFieldValue(data, NAME_FIELD);
            this.title = getFieldValue(data, TITLE_FIELD);
            this.phone = getFieldValue(data, PHONE_FIELD);
            this.email = getFieldValue(data, EMAIL_FIELD);
            this.picture = getFieldValue(data, PICTURE_FIELD);
        }
    }

    @wire(MessageContext)
    messageContext;

    // Handler for message received by component
    handleMessage(message) {
        this.recordId = message.recordId;
    }

    // Functions to encapsulate logic for subscription state
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                recordSelected,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    // Standard lifecycle hooks used to sub/unsub to message channel
    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }
}
