import { LightningElement, wire, api } from 'lwc';
import { getRecords } from 'lightning/uiRecordApi';
import USER_NAME_FIELD from '@salesforce/schema/User.Name';
import USER_EMAIL_FIELD from '@salesforce/schema/User.Email';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';

export default class WireGetRecords extends LightningElement {
    @wire(getRecords, { 
        records: [
            { 
                recordIds: ['005xx000001X83aAAC'], 
                fields: [USER_NAME_FIELD], 
                optionalFields: [USER_EMAIL_FIELD]
            },
            { 
                recordIds: ['005xx000001X83aAAK'], 
                fields: [ACCOUNT_NAME_FIELD]
            },

        ]
    }) records;

    get recordStr() {
        return this.records
            ? JSON.stringify(this.records, null, 2)
            : '';
    }
}
