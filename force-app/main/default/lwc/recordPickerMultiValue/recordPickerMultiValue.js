import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import CONTACT_NAME_FIELD from '@salesforce/schema/Contact.Name';

// As of today, `lightning-record-picker` only supports a single selection.
// This sample component shows how you can turn `lightning-record-picker` into
// a multi-selection record picker.

// Converts a record to a lightning-pill element
const toContactPill = (record) => ({
    name: record.id,
    label: record.name,
    iconName: 'standard:contact',
    type: 'icon'
});

// Converts a list a IDs to lightning-record-picker filter
const toRecordPickerFilter = (ids) => ({
    criteria: [
        {
            fieldPath: 'Id',
            operator: 'nin', // "not in" operator
            value: ids
        }
    ]
});

export default class RecordPickerMultiValue extends LightningElement {
    /**
     * The last selected record ID.
     * Used to trigger getRecord @wire calls.
     */
    recordId;

    /**
     * The list of selected records (id and name).
     * Used to compute and update the list of pill items
     * and to update the record picker filter
     * as we want to filter out already selected records from the record picker suggestions
     */
    selectedRecords = [];

    /**
     * Builds lightning-pill items from `selectedRecords`
     */
    get pillItems() {
        return this.selectedRecords.map(toContactPill);
    }

    /**
     * Builds lightning-record-picker filter from `selectedRecords`
     */
    get recordPickerFilter() {
        // Convert selectedRecords to a list of IDs
        const selectedRecordIds = this.selectedRecords.map(
            (record) => record.id
        );
        return toRecordPickerFilter(selectedRecordIds);
    }

    /**
     * getRecord wire adapter is used here to get the name of the records
     * that are selected in the record picker.
     * Note: GraphQL could also be used (see recordPickerHello.js)
     */
    @wire(getRecord, {
        recordId: '$recordId',
        fields: [CONTACT_NAME_FIELD]
    })
    wiredGetRecord({ data, error }) {
        this.wireError = error;
        if (error || !data) {
            return;
        }
        // Reset recordId to ensure the wire can be called a second time the same recordId
        this.recordId = undefined;

        this.selectedRecords = [
            ...this.selectedRecords,
            {
                id: data.id,
                name: data.fields[CONTACT_NAME_FIELD.fieldApiName].value
            }
        ];
    }

    handlePillRemove(event) {
        const recordId = event.detail.item.name;

        // Remove `recordId` from `selectedRecords`
        this.selectedRecords = this.selectedRecords.filter(
            (record) => record.id !== recordId
        );
    }

    handleRecordPickerChange(event) {
        // trigger getRecord wire
        this.recordId = event.detail.recordId;

        // We want the record picker input to be cleared
        // each time the user selects a record suggestion
        this.refs.recordPicker.clearSelection();
    }
}
