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
import EXPECTEDREVENUE_FIELD from '@salesforce/schema/Account.ExpectedRevenue__c';

export default class LdsCreateRecordWithRecordInput extends LightningElement {
    areaNumber;
    areaNumberEditable;
    error;
    expectedRevenue;
    expectedRevenueEditable;
    name;
    nameEditable;
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
            this.setState();
        } else if (error) {
            this.setState(error);
        }
    }

    setState(error) {
        if (error) {
            this.nameEditable = false;
            this.areaNumberEditable = false;
            this.expectedRevenueEditable = false;
            this.name = '';
            this.areaNumber = '';
            this.expectedRevenue = '';
            this.error = error;
        } else {
            const fields = this.recordInput.fields;
            this.nameEditable = fields.hasOwnProperty(NAME_FIELD.fieldApiName);
            this.areaNumberEditable = fields.hasOwnProperty(
                AREANUMBER_FIELD.fieldApiName
            );
            this.expectedRevenueEditable = fields.hasOwnProperty(
                EXPECTEDREVENUE_FIELD.fieldApiName
            );
            this.name = this.nameEditable
                ? fields[NAME_FIELD.fieldApiName]
                : '';
            this.areaNumber = this.areaNumberEditable
                ? fields[AREANUMBER_FIELD.fieldApiName]
                : '';
            this.expectedRevenue = this.expectedRevenueEditable
                ? fields[EXPECTEDREVENUE_FIELD.fieldApiName]
                : '';
            this.error = undefined;
        }
    }

    handleNameChange(event) {
        this.name = event.target.value;
    }

    handleAreaNumberChange(event) {
        this.areaNumber = event.target.value;
    }

    handleExpectedRevenueChange(event) {
        this.expectedRevenue = event.target.value;
    }

    createAccount() {
        if (this.nameEditable)
            this.recordInput.fields[NAME_FIELD.fieldApiName] = this.name;
        if (this.areaNumberEditable)
            this.recordInput.fields[
                AREANUMBER_FIELD.fieldApiName
            ] = this.areaNumber;
        if (this.expectedRevenueEditable)
            this.recordInput.fields[
                EXPECTEDREVENUE_FIELD.fieldApiName
            ] = this.expectedRevenue;
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
