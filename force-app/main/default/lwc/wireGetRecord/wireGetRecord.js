import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/User.Name';
import EMAIL_FIELD from '@salesforce/schema/User.Email';

export default class WireGetRecord extends LightningElement {
    @wire(getRecord, { 
        recordId: '005xx000001X8BdAAK', 
        fields: [NAME_FIELD], 
        optionalFields: [EMAIL_FIELD]  
    }) record;

    get recordStr() {
        return this.record
            ? JSON.stringify(this.record, null, 2)
            : '';
    }
}
