import { LightningElement, api } from 'lwc';

export default class RecordContextScreenAction extends LightningElement {
    @api recordId;
    @api objectApiName;
}
