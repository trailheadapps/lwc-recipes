import { LightningElement, wire } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';

export default class ContactSelector extends LightningElement {
    contactOptions = [];
    error;

    @wire(getContactList)
    wiredContacts({ error, data }) {
        if (data) {
            this.contactOptions = data.map((record) => ({
                value: record.Id,
                label: record.Name
            }));
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.contactOptions = undefined;
        }
    }

    handleRecordSelected(event) {
        this.dispatchEvent(
            new CustomEvent('select', {
                detail: { recordId: event.target.value }
            })
        );
    }
}
