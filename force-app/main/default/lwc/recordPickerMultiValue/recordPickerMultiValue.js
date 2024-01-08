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

class Observable {
    _selectedRecords;
    constructor() {
        this._observers = [];
    }

    addObserver(func) {
        this._observers.push(func);
    }

    get selectedRecords() {
        return this._selectedRecords;
    }

    set selectedRecords(value) {
        this._selectedRecords = value;
        this._observers.forEach((observer) => observer(value));
    }
}

export default class RecordPickerMultiValue extends LightningElement {
    currentSelectedRecordId;

    state = new Observable();

    @track
    pillItems;

    @track
    recordPickerFilter;

    constructor() {
        super();

        this.state.addObserver((selectedRecords) => {
            this.pillItems = selectedRecords.map(toContactPill);
        });

        this.state.addObserver((selectedRecords) => {
            this.recordPickerFilter = toRecordPickerFilter(
                selectedRecords.map((record) => record.id)
            );
        });
        this.state.selectedRecords = [];
    }

    handleRecordPickerChange(event) {
        this.currentSelectedRecordId = event.detail.recordId;
    }

    @wire(getRecord, {
        recordId: '$currentSelectedRecordId',
        fields: [CONTACT_NAME_FIELD]
    })
    wiredGetRecord({ data, error }) {
        if (error || !data) {
            return;
        }

        const recordId = this.currentSelectedRecordId;

        this.state.selectedRecords = [
            ...this.state.selectedRecords,
            {
                id: recordId,
                name: data.fields[CONTACT_NAME_FIELD.fieldApiName].value
            }
        ];

        this.currentSelectedRecordId = null;

        this.refs.recordPicker.clearSelection();
    }

    handleItemRemove(event) {
        const recordId = event.detail.item.name;
        this.state.selectedRecords = this.state.selectedRecords.filter(
            (record) => record.id !== recordId
        );
    }
}
