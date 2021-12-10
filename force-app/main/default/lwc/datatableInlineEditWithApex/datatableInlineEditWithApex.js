import { LightningElement, wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContactList';
import updateContacts from '@salesforce/apex/ContactController.updateContacts';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const COLS = [
    { label: 'First Name', fieldName: 'FirstName', editable: true },
    { label: 'Last Name', fieldName: 'LastName', editable: true },
    { label: 'Title', fieldName: 'Title', editable: true },
    { label: 'Phone', fieldName: 'Phone', type: 'phone', editable: true },
    { label: 'Email', fieldName: 'Email', type: 'email', editable: true }
];

export default class DatatableInlineEditWithApex extends LightningElement {
    columns = COLS;
    draftValues = [];

    @wire(getContacts)
    contacts;

    async handleSave(event) {
        const updatedFields = event.detail.draftValues;

        try {
            // Pass edited fields to the updateContacts Apex controller
            await updateContacts({ contactsForUpdate: updatedFields });
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contact(s) updated',
                    variant: 'success'
                })
            );

            // Display fresh data in the datatable
            await refreshApex(this.contacts).then(() => {
                // Clear all draft values in the datatable
                this.draftValues = [];
            });
        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or refreshing records',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        }
    }
}
