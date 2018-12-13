import { LightningElement, wire, track } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';

export default class EventBubbling extends LightningElement {
    @track selectedContact;

    @wire(getContactList) contacts;

    handleContactSelect(event) {
        this.selectedContact = event.target.contact;
    }
}
