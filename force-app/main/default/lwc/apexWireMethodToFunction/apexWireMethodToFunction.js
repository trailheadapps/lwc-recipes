import { LightningElement, wire, track } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';

export default class ApexWireMethodToFunction extends LightningElement {
    @track contacts;
    @track error;

    @wire(getContactList)
    wiredContacts({ error, data }) {
        if (data || error) {
            this.contacts = data;
            this.error = error;
        }
    }
}
