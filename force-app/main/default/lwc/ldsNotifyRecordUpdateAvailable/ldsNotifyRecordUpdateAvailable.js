import { LightningElement, api, wire } from 'lwc';
import updateContact from '@salesforce/apex/ContactController.updateContact';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {
    getRecord,
    getFieldValue,
    notifyRecordUpdateAvailable
} from 'lightning/uiRecordApi';

import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';

const fields = [FIRSTNAME_FIELD, LASTNAME_FIELD];

export default class LdsNotifyRecordUpdateAvailable extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields })
    contact;

    get firstName() {
        return getFieldValue(this.contact.data, FIRSTNAME_FIELD);
    }

    get lastName() {
        return getFieldValue(this.contact.data, LASTNAME_FIELD);
    }

    updateContact() {
        updateContact({
            id: this.recordId,
            firstName: this.refs.firstName.value,
            lastName: this.refs.lastName.value
        })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Contact updated',
                        variant: 'success'
                    })
                );
                notifyRecordUpdateAvailable([{ recordId: this.recordId }]);
            })
            .catch((error) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
}
