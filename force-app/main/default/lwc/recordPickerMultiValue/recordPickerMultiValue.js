import { LightningElement, wire, track } from 'lwc';
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

    @track
    contactItems = [];

    @track
    recordFilter = {
        criteria: [
            {
                fieldPath: 'Id',
                operator: 'nin',
                value: []
            }
        ]
    };

    handleRecordPickerChange(event) {
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
            label: recordName,
            iconName: 'standard:contact'
        });

        this.currentSelectedRecordId = null;
        this._addRecordToFilter(recordId);
        this.refs.recordPicker.clearSelection();
    }

    handleItemRemove(event) {
        const recordId = event.detail.item.name;
        this.contactItems.splice(
            this.contactItems.findIndex((item) => item.name === recordId),
            1
        );

        this._removeRecordFromFilter(recordId);
    }

    _addRecordToFilter(recordId) {
        this.recordFilter.criteria[0].value.push(recordId);
    }

    _removeRecordFromFilter(recordId) {
        const filterValue = this.recordFilter.criteria[0].value;
        const recordIndex = filterValue.findIndex((id) => id === recordId);

        filterValue.splice(recordIndex, 1);
    }
}
