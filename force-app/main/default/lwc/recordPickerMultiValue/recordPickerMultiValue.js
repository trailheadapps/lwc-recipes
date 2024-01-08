import { LightningElement, wire, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import CONTACT_NAME_FIELD from '@salesforce/schema/Contact.Name';

// As of today, `lightning-record-picker` only supports a single selection.
// This sample component shows how you can turn `lightning-record-picker` into
// a multi-selection record picker.

// Converts a record to a lightning-pill element
const toContactPill = (record) => ({
    name: record.id,
    label: record.name,
    iconName: 'standard:contact'
});

const toRecordPickerFilter = (ids) => ({
    criteria: [
        {
            fieldPath: 'Id',
            operator: 'nin',
            value: ids
        }
    ]
});

export default class RecordPickerMultiValue extends LightningElement {
    lastSelectedRecordId;

    selectedRecords = [];

    @track
    pillItems;

    @track
    recordPickerFilter;

    handleRecordPickerChange(event) {
        this.lastSelectedRecordId = event.detail.recordId;
    }

    @wire(getRecord, {
        recordId: '$lastSelectedRecordId',
        fields: [CONTACT_NAME_FIELD]
    })
    wiredGetRecord({ data, error }) {
        if (error || !data) {
            return;
        }

        const recordId = this.lastSelectedRecordId;

        this.selectedRecords = [
            ...this.selectedRecords,
            {
                id: recordId,
                name: data.fields[CONTACT_NAME_FIELD.fieldApiName].value
            }
        ];
        this._updatePillItems();
        this._updateRecordPickerFilter();

        this.refs.recordPicker.clearSelection();
    }

    _updatePillItems() {
        this.pillItems = this.selectedRecords.map(toContactPill);
    }

    _updateRecordPickerFilter() {
        this.recordPickerFilter = toRecordPickerFilter(
            this.selectedRecords.map((record) => record.id)
        );
    }

    handleItemRemove(event) {
        const recordId = event.detail.item.name;
        this.selectedRecords = this.selectedRecords.filter(
            (record) => record.id !== recordId
        );
        this._updatePillItems();
        this._updateRecordPickerFilter();
    }
}
