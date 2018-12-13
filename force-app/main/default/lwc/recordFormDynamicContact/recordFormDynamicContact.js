import { LightningElement, api } from 'lwc';

export default class RecordFormDynamicContact extends LightningElement {
    // Flexipage provides recordId and objectApiName
    @api recordId;
    @api objectApiName;
    fields = ['Name', 'Title', 'Phone', 'Email'];
}
