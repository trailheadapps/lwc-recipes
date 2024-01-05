import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
// import CONTACT_NAME_FIELD from '@salesforce/schema/Contact.Name';

const CONTACT_NAME_FIELD = {
    default: {
        fieldApiName: 'Name',
        objectApiName: 'Contact'
    }
};

export default class RecordPickerMultiValue extends LightningElement {
    currentSelectedRecordId;

    handleContactRecordPickerChange(event) {
        this.currentSelectedRecordId = event.detail.recordId;
    }

    @wire(getRecord, {
        recordId: '$currentSelectedRecordId',
        fields: [CONTACT_NAME_FIELD.default]
    })
    wiredGetRecord({ data, error }) {
        if (error || !data) {
            return;
        }

        const recordId = this.currentSelectedRecordId;
        const recordName =
            data.fields[CONTACT_NAME_FIELD.default.fieldApiName].value;

        this.contactItems.push({
            name: recordId,
            label: recordName
        });

        this.currentSelectedRecordId = null;
        this.refs.recordPicker.clearSelection();
    }
}
