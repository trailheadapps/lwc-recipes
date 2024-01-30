import { LightningElement } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';

export default class ApexImperativeMethod extends LightningElement {
    contacts;
    error;

    async handleLoad() {
        try {
            this.contacts = await getContactList();
            this.error = undefined;
        } catch (error) {
            this.contacts = undefined;
            this.error = error;
        }
    }
}
