import { LightningElement } from 'lwc';

// As of today, `lightning-record-picker` only supports a single target.
// This sample component shows how you can turn `lightning-record-picker` into
// a multi-target record picker, where the user can select the target object
// before searching.
export default class RecordPickerDynamicTarget extends LightningElement {
    targetObjects = [
        {
            label: 'Account',
            value: 'Account'
        },
        {
            label: 'Contact',
            value: 'Contact'
        }
    ];
    selectedTarget = 'Account';
    currentSelectedRecordId = null;

    displayInfos = {
        Account: {
            additionalFields: ['Type']
        },
        Contact: {
            additionalFields: ['Phone']
        }
    };

    matchingInfos = {
        Account: {
            additionalFields: [{ fieldPath: 'Type' }]
        },
        Contact: {
            additionalFields: [{ fieldPath: 'Phone' }]
        }
    };

    get displayInfo() {
        return this.displayInfos[this.selectedTarget];
    }

    get matchingInfo() {
        return this.matchingInfos[this.selectedTarget];
    }

    get showTargetSelector() {
        return this.currentSelectedRecordId === null;
    }

    handleTargetSelection(event) {
        // Prevent lightning-combobox `change` event from bubbling
        event.stopPropagation();

        this.selectedTarget = event.target.value;
        this.refs.recordPicker.clearSelection();
    }

    handleRecordSelect(event) {
        this.currentSelectedRecordId = event.detail.recordId;
    }
}
