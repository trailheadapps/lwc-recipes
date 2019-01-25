/**
 * The pubsub communication approach is used to provide a communication mechanism between sibling components assembled in a flexipage (App Builder) where traditional parent/child communication patterns are not available.
 * Do NOT use this utility for parent/child communication. Use the guidelines below instead.
 * For child-to-parent communication, fire a DOM event in the child component
 * For parent-to-child communication, use property passing or call a public @api method defined in the child component
 */
import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { reduceErrors } from 'c/ldsUtils';

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

export default class PubsubContactDetails extends LightningElement {
    recordId;

    @track name;
    @track title;
    @track phone;
    @track email;
    @track picture;

    @wire(CurrentPageReference) pageRef;

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

    connectedCallback() {
        registerListener('contactSelected', this.handleContactSelected, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    handleContactSelected(contactId) {
        this.recordId = contactId;
    }
}
