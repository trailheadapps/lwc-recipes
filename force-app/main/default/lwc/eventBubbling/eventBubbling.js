import { LightningElement, wire } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';

export default class EventBubbling extends LightningElement {
    selectedContact;

    @wire(getContactList) contacts;

    handleContactSelect(event) {
        this.selectedContact = event.target.contact;
    }
}
