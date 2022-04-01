import { LightningElement, wire, api } from 'lwc';
import { getRecords } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/User.Name';
import EMAIL_FIELD from '@salesforce/schema/User.Email';

export default class WireGetRecords extends LightningElement {
    @wire(getRecords, { 
        records: [
            { 
                recordIds: ['005xx000001X83aAAC', '005xx000001X8BdAAK'], 
                fields: [NAME_FIELD], 
                optionalFields: [EMAIL_FIELD]
            }
        ]
    }) records;

    get recordStr() {
        return this.records
            ? JSON.stringify(this.records, null, 2)
            : '';
    }
}
