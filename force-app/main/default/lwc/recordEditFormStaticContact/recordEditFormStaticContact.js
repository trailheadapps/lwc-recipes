import { LightningElement, api } from 'lwc';

import ACCOUNT_FIELD from '@salesforce/schema/Contact.AccountId';
import NAME_FIELD from '@salesforce/schema/Contact.Name';
import TITLE_FIELD from '@salesforce/schema/Contact.Title';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';

export default class RecordEditFormStaticContact extends LightningElement {
    // Exposing fields to make them available in the template
    accountField = ACCOUNT_FIELD;
    nameField = NAME_FIELD;
    titleField = TITLE_FIELD;
    phoneField = PHONE_FIELD;
    emailField = EMAIL_FIELD;

    @api recordId;
    @api objectApiName;
}
