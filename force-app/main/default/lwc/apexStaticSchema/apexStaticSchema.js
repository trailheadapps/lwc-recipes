import { LightningElement, wire } from 'lwc';
import { getSObjectValue } from '@salesforce/apex';
import getSingleContact from '@salesforce/apex/ContactController.getSingleContact';

import NAME_FIELD from '@salesforce/schema/Contact.Name';
import TITLE_FIELD from '@salesforce/schema/Contact.Title';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';

export default class ApexStaticSchema extends LightningElement {
    @wire(getSingleContact) contact;

    get name() {
        return this.contact.data
            ? getSObjectValue(this.contact.data, NAME_FIELD)
            : '';
    }
    get title() {
        return this.contact.data
            ? getSObjectValue(this.contact.data, TITLE_FIELD)
            : '';
    }
    get email() {
        return this.contact.data
            ? getSObjectValue(this.contact.data, EMAIL_FIELD)
            : '';
    }
}
