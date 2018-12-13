import { LightningElement, api } from 'lwc';

import NAME_FIELD from '@salesforce/schema/Contact.Name';
import TITLE_FIELD from '@salesforce/schema/Contact.Title';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';

export default class RecordFormStaticContact extends LightningElement {
    // Flexipage provides recordId and objectApiName
    @api recordId;
    @api objectApiName;

    fields = [NAME_FIELD, TITLE_FIELD, PHONE_FIELD, EMAIL_FIELD];
}
