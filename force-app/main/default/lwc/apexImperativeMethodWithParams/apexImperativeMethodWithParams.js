import { LightningElement } from 'lwc';
import findContacts from '@salesforce/apex/ContactController.findContacts';

export default class ApexImperativeMethodWithParams extends LightningElement {
    searchKey = '';
    contacts;
    error;

    handleKeyChange(event) {
        this.searchKey = event.target.value;
    }

    async handleSearch() {
        try {
            this.contacts = await findContacts({ searchKey: this.searchKey });
            this.error = undefined;
        } catch (error) {
            this.error = error;
            this.contacts = undefined;
        }
    }
}
