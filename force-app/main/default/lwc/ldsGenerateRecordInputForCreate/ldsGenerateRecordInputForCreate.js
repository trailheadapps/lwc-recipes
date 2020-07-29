import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {
    createRecord,
    getRecordCreateDefaults,
    generateRecordInputForCreate
} from 'lightning/uiRecordApi';
import { reduceErrors } from 'c/ldsUtils';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import AREANUMBER_FIELD from '@salesforce/schema/Account.AreaNumber__c';

export default class LdsGenerateRecordInputForCreate extends LightningElement {
    areaNumber;
    areaNumberField = AREANUMBER_FIELD.fieldApiName;
    areaNumberCreateable;
    error;
    nameField = NAME_FIELD.fieldApiName;
    recordInput;

    @wire(getRecordCreateDefaults, { objectApiName: ACCOUNT_OBJECT })
    loadAccountCreateDefaults({ data, error }) {
        if (data) {
            // Creates a record input with default field values
            this.recordInput = generateRecordInputForCreate(
                data.record,
                data.objectInfos[ACCOUNT_OBJECT.objectApiName] // Filters it to only createable fields
            );
            const fields = this.recordInput.fields;
            this.areaNumberCreateable = AREANUMBER_FIELD.fieldApiName in fields;
            this.areaNumber = fields[AREANUMBER_FIELD.fieldApiName];
            this.error = undefined;
        } else if (error) {
            this.recordInput = undefined;
            this.error = error;
        }
    }

    handleFieldChange(event) {
        this.recordInput.fields[event.target.dataset.fieldName] =
            event.target.value;
    }

    createAccount() {
        createRecord(this.recordInput)
            .then((account) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Account created, with id: ' + account.id,
                        variant: 'success'
                    })
                );
            })
            .catch((error) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: reduceErrors(error).join(', '),
                        variant: 'error'
                    })
                );
            });
    }
}
