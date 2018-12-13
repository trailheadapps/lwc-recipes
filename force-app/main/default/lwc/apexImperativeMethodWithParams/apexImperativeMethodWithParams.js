import { LightningElement, track } from 'lwc';
import findContacts from '@salesforce/apex/ContactController.findContacts';

export default class ApexImperativeMethodWithParams extends LightningElement {
    @track searchKey = '';
    @track contacts;
    @track error;

    handleKeyChange(event) {
        this.searchKey = event.target.value;
    }

    handleSearch() {
        findContacts({ searchKey: this.searchKey })
            .then(result => {
                this.contacts = result;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.contacts = undefined;
            });
    }
}
