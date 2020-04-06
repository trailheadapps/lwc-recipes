import { LightningElement } from 'lwc';
import findContacts from '@salesforce/apex/ContactController.findContacts';

export default class ApexImperativeMethodWithParams extends LightningElement {
    searchKey = '';
    contacts;
    error;

    handleKeyChange(event) {
        this.searchKey = event.target.value;
    }

    handleSearch() {
        findContacts({ searchKey: this.searchKey })
            .then((result) => {
                this.contacts = result;
                this.error = undefined;
            })
            .catch((error) => {
                this.error = error;
                this.contacts = undefined;
            });
    }
}
