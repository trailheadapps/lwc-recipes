import { LightningElement, wire } from 'lwc';
import { getRecords } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Contact.Name';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import getContactList from '@salesforce/apex/ContactController.getContactList';
import getAccountList from '@salesforce/apex/AccountController.getAccountList';

export default class WireGetRecordsDifferentTypes extends LightningElement {
    records = [];

    @wire(getAccountList)
    wiredAccounts({ error, data }) {
        if (data) {
            const accountRecord = [
                {
                    recordIds: [data[0].Id],
                    fields: [ACCOUNT_NAME_FIELD]
                }
            ];
            this.records = this.records
                ? this.records.concat(accountRecord)
                : accountRecord;
            this.error = undefined;
        } else if (error) {
            this.error = error;
        }
    }

    @wire(getContactList)
    wiredContacts({ error, data }) {
        if (data) {
            const contactRecord = [
                {
                    recordIds: [data[0].Id],
                    fields: [NAME_FIELD],
                    optionalFields: [EMAIL_FIELD]
                }
            ];
            this.records = this.records
                ? this.records.concat(contactRecord)
                : contactRecord;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.contacts = undefined;
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
