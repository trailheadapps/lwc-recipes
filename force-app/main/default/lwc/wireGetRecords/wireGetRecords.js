import { LightningElement, wire } from 'lwc';
import { getRecords } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Contact.Name';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import getContactList from '@salesforce/apex/ContactController.getContactList';

export default class WireGetRecords extends LightningElement {
    records;

    @wire(getContactList)
    wiredContacts({ error, data }) {
        if (data) {
            this.records = [
                {
                    recordIds: [data[0].Id, data[1].Id],
                    fields: [NAME_FIELD],
                    optionalFields: [EMAIL_FIELD]
                }
            ];
            this.error = undefined;
        } else if (error) {
            this.error = error;
        }
    }

    @wire(getRecords, {
        records: '$records'
    })
    recordResults;

    get recordStr() {
        return this.recordResults
            ? JSON.stringify(this.recordResults.data, null, 2)
            : '';
    }
}
