import { LightningElement, track, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import CONTACT_NAME_FIELD from '@salesforce/schema/Contact.Name';

export default class RecordPickerMultiValue extends LightningElement {
    @track contactItems = [];
    @track recordPickerFilter = {
        criteria: [
            {
                fieldPath: 'Id',
                operator: 'nin',
                value: []
            }
        ]
    };

    currentlySelectedRecordId;
    logs = '';
    recordPickerFilterAsString = '';

    renderedCallback() {
        this._updateDisplayedFilter();
    }

    _log(message) {
        this.logs += `-  ${message}\n`;
    }

    _updateDisplayedFilter() {
        this.recordPickerFilterAsString = this.recordPickerFilter
            ? JSON.stringify(this.recordPickerFilter, null, '\t')
            : '';
    }

    _addRecordToFilter(recordId) {
        this.recordPickerFilter.criteria[0].value.push(recordId);
        this._updateDisplayedFilter();
    }

    _removeRecordFromFilter(recordId) {
        const filterValueArray = this.recordPickerFilter.criteria[0].value;
        const recordIndex = filterValueArray.findIndex((id) => id === recordId);

        filterValueArray.splice(recordIndex, 1);
        this._updateDisplayedFilter();
    }

    @wire(getRecord, {
        recordId: '$currentlySelectedRecordId',
        fields: [CONTACT_NAME_FIELD]
    })
    wiredGetRecord({ data, error }) {
        if (error || !data) {
            return;
        }

        const recordId = this.currentlySelectedRecordId;
        const recordName = data.fields[CONTACT_NAME_FIELD.fieldApiName].value;

        this.contactItems.push({
            name: recordId,
            label: recordName
        });
        this._log(`Select ${recordName} (${recordId}).`);

        this._addRecordToFilter(recordId);
        this._log(`Exclude ${recordName} (${recordId}) from results.`);

        this.currentlySelectedRecordId = null;
        this.refs.recordPicker.clearSelection();
    }

    handleContactRecordPickerChange(event) {
        if (event.detail.recordId === null) {
            return; // do nothing
        }

        this.currentlySelectedRecordId = event.detail.recordId;
    }

    handleContactItemRemove(event) {
        const recordId = event.detail.item.name;
        const recordName = event.detail.item.label;

        this.contactItems.splice(
            this.contactItems.findIndex((item) => item.name === recordId),
            1
        );
        this._log(`Unselect ${recordName} (${recordId}).`);

        this._removeRecordFromFilter(recordId);
        this._log(`Don't exclude ${recordName} (${recordId}) from results.`);
    }
}
