import { LightningElement, wire, api } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

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

export default class ContactInfo extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields }) contact;

    get name() {
        return getFieldValue(this.contact.data, NAME_FIELD);
    }

    get title() {
        return getFieldValue(this.contact.data, TITLE_FIELD);
    }

    get phone() {
        return getFieldValue(this.contact.data, PHONE_FIELD);
    }

    get email() {
        return getFieldValue(this.contact.data, EMAIL_FIELD);
    }

    get picture() {
        return getFieldValue(this.contact.data, PICTURE_FIELD);
    }
}
