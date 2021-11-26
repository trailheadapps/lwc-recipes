import { LightningElement, wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContactList';
import updateContacts from '@salesforce/apex/ContactController.updateContacts';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const COLS = [
    { label: 'First Name', fieldName: 'FirstName', editable: true },
    { label: 'Last Name', fieldName: 'LastName', editable: true },
    { label: 'Title', fieldName: 'Title', editable: true },
    { label: 'Phone', fieldName: 'Phone', type: 'phone', editable: true },
    { label: 'Email', fieldName: 'Email', type: 'email', editable: true }
];

export default class DatatableMultilineEdit extends LightningElement {
    columns = COLS;
    draftValues = [];

    @wire(getContacts)
    contacts;
    async handleSave(event) {
        const updatedFields = event.detail.draftValues;

        // Prepare the record IDs for getRecordNotifyChange()
        const notifyChangeIds = updatedFields.map((row) => {
            return { recordId: row.Id };
        });

        try {
            // Pass edited fields to the updateContacts Apex controller
            console.dir({ data: updatedFields });
            await updateContacts({ data: updatedFields });
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contact updated',
                    variant: 'success'
                })
            );

            // Refresh LDS cache and wires
            getRecordNotifyChange(notifyChangeIds);

            // Display fresh data in the datatable
            refreshApex(this.contacts).then(() => {
                // Clear all draft values in the datatable
                this.draftValues = [];
            });
        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or refreshing records',
                    message: error.message,
                    variant: 'error'
                })
            );
        }
    }
}
