import { LightningElement, api } from 'lwc';

export default class RecordViewFormDynamicContact extends LightningElement {
    // Flexipage provides recordId and objectApiName
    @api recordId;
    @api objectApiName;
}
