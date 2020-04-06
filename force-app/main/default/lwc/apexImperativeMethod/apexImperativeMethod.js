import { LightningElement } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';

export default class ApexImperativeMethod extends LightningElement {
    contacts;
    error;

    handleLoad() {
        getContactList()
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
