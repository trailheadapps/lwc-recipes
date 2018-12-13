import { LightningElement, api } from 'lwc';

export default class RecordEditFormDynamicContact extends LightningElement {
    @api recordId;
    @api objectApiName;
}
