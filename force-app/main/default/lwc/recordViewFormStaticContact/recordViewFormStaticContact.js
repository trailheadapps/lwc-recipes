import { LightningElement, api } from 'lwc';

import NAME_FIELD from '@salesforce/schema/Contact.Name';
import TITLE_FIELD from '@salesforce/schema/Contact.Title';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';

export default class RecordViewFormStaticContact extends LightningElement {
    // Exposing fields to make them available in the template
    nameField = NAME_FIELD;
    titleField = TITLE_FIELD;
    phoneField = PHONE_FIELD;
    emailField = EMAIL_FIELD;

    // Flexipage provides recordId and objectApiName
    @api recordId;
    @api objectApiName;
}
