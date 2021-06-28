import { LightningElement, api, wire } from "lwc";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CloseActionScreenEvent } from 'lightning/actions';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
import ID_FIELD from '@salesforce/schema/Account.Id';
import NAME_FIELD from '@salesforce/schema/Account.Name';

export default class EditRecordScreenAction extends LightningElement {
    @api recordId;
    @api objectApiName;

    @wire(getRecord, { recordId: '$recordId', fields: [ NAME_FIELD ] })
    account;

    get name() {
        return this.account.data ? this.account.data.fields.Name.value : null;
    }

    handleSave() {
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.recordId;
        fields[NAME_FIELD.fieldApiName] = this.template.querySelector("[data-field='Name']").value;

        const recordInput = { fields };

        updateRecord(recordInput)
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Account updated',
                    variant: 'success'
                })
            );
            
            this.dispatchEvent(new CloseActionScreenEvent());
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating record, try again...',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }

    handleCancel() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }
}
