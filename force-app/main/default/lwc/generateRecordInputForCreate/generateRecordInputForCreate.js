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

export default class GenerateRecordInputForCreate extends LightningElement {
    areaNumber;
    areaNumberField = AREANUMBER_FIELD;
    areaNumberCreateable;
    error;
    name;
    nameField = NAME_FIELD;
    recordInput;

    @wire(getRecordCreateDefaults, { objectApiName: ACCOUNT_OBJECT })
    loadAccountCreateDefaults({ data, error }) {
        if (data) {
            const accountObjectInfo =
                data.objectInfos[ACCOUNT_OBJECT.objectApiName];
            const recordDefaults = data.record;
            // Creates an account record input with default field values
            this.recordInput = generateRecordInputForCreate(
                recordDefaults,
                accountObjectInfo // ObjectInfo filters it to only fields that are createable
            );
            const fields = this.recordInput.fields;
            this.areaNumberCreateable = AREANUMBER_FIELD.fieldApiName in fields;
            this.areaNumber = fields[AREANUMBER_FIELD.fieldApiName];
            this.error = undefined;
        } else if (error) {
            this.areaNumberCreateable = undefined;
            this.areaNumber = undefined;
            this.name = undefined;
            this.error = error;
        }
    }

    handleFieldChange(event) {
        this[event.dataset.target.fieldName] = event.target.value;
    }

    createAccount() {
        this.recordInput.fields[NAME_FIELD.fieldApiName] = this.name;
        if (this.areaNumberCreateable) {
            this.recordInput.fields[
                AREANUMBER_FIELD.fieldApiName
            ] = this.areaNumber;
        }
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
