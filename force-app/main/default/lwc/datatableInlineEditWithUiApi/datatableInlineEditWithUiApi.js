import { LightningElement, wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContactList';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ID_FIELD from '@salesforce/schema/Contact.Id';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import TITLE_FIELD from '@salesforce/schema/Contact.Title';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';

const COLS = [
    {
        label: 'First Name',
        fieldName: FIRSTNAME_FIELD.fieldApiName,
        editable: true
    },
    {
        label: 'Last Name',
        fieldName: LASTNAME_FIELD.fieldApiName,
        editable: true
    },
    { label: 'Title', fieldName: TITLE_FIELD.fieldApiName, editable: true },
    {
        label: 'Phone',
        fieldName: PHONE_FIELD.fieldApiName,
        type: 'phone',
        editable: true
    },
    {
        label: 'Email',
        fieldName: EMAIL_FIELD.fieldApiName,
        type: 'email',
        editable: true
    }
];
export default class DatatableInlineEditWithUiApi extends LightningElement {
    columns = COLS;
    draftValues = [];

    @wire(getContacts)
    contacts;

    handleSave(event) {
        const fields = {};
        fields[ID_FIELD.fieldApiName] = event.detail.draftValues[0].Id;
        fields[FIRSTNAME_FIELD.fieldApiName] =
            event.detail.draftValues[0].FirstName;
        fields[LASTNAME_FIELD.fieldApiName] =
            event.detail.draftValues[0].LastName;
        fields[TITLE_FIELD.fieldApiName] = event.detail.draftValues[0].Title;
        fields[PHONE_FIELD.fieldApiName] = event.detail.draftValues[0].Phone;
        fields[EMAIL_FIELD.fieldApiName] = event.detail.draftValues[0].Email;

        const recordInput = { fields };

        updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Contact updated',
                        variant: 'success'
                    })
                );
                // Display fresh data in the datatable
                return refreshApex(this.contacts).then(() => {
                    // Clear all draft values in the datatable
                    this.draftValues = [];
                });
            })
            .catch((error) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating or reloading record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
}
