import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CloseActionScreenEvent } from 'lightning/actions';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
import ID_FIELD from '@salesforce/schema/Contact.Id';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';

export default class EditRecordScreenAction extends LightningElement {
    @api recordId;
    @api objectApiName;

    @wire(getRecord, {
        recordId: '$recordId',
        fields: [FIRSTNAME_FIELD, LASTNAME_FIELD]
    })
    contact;

    get firstname() {
        return this.contact.data
            ? this.contact.data.fields.FirstName.value
            : null;
    }

    get lastname() {
        return this.contact.data
            ? this.contact.data.fields.LastName.value
            : null;
    }

    async handleSave() {
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.recordId;
        fields[FIRSTNAME_FIELD.fieldApiName] = this.template.querySelector(
            "[data-field='FirstName']"
        ).value;
        fields[LASTNAME_FIELD.fieldApiName] = this.template.querySelector(
            "[data-field='LastName']"
        ).value;
        const recordInput = { fields };

        try {
            await updateRecord(recordInput);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contact updated',
                    variant: 'success'
                })
            );
            this.dispatchEvent(new CloseActionScreenEvent());
        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating record, try again...',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        }
    }

    handleCancel() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }
}
