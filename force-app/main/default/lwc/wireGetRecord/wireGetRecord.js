import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/User.Name';
import EMAIL_FIELD from '@salesforce/schema/User.Email';
import Id from '@salesforce/user/Id';

export default class WireGetRecord extends LightningElement {
    userId = Id;

    @wire(getRecord, {
        recordId: '$userId',
        fields: [NAME_FIELD],
        optionalFields: [EMAIL_FIELD]
    })
    record;

    get recordStr() {
        return this.record ? JSON.stringify(this.record.data, null, 2) : '';
    }
}
