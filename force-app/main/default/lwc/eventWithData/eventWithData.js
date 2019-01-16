import { LightningElement, wire, track } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';

export default class EventWithData extends LightningElement {
    @track selectedContact;

    @wire(getContactList) contacts;

    handleSelect(event) {
        const contactId = event.detail;
        this.selectedContact = this.contacts.data.find(
            contact => contact.Id === contactId
        );
    }
}
