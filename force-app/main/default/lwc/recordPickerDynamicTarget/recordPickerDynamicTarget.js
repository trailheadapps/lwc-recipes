import { wire, LightningElement, api } from 'lwc';
import { getObjectInfos } from 'lightning/uiObjectInfoApi';

export default class RecordPickerDynamicTarget extends LightningElement {
    placeholder = 'Search...';

    @api
    label = 'Select a record';

    objectApiNames = ['Account', 'Case', 'Contact'];
    selectedTarget = 'Account';
    objectInfos = [];
    isObjectInfoLoading = true;
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
        return this.displayInfos?.[this.selectedTarget];
    }

    get matchingInfo() {
        return this.matchingInfos?.[this.selectedTarget];
    }

    get targetObjects() {
        if (this.isObjectInfoLoading) {
            return [];
        }

        return this.objectInfos.map((objectInfo) => {
            return {
                label: objectInfo.label,
                value: objectInfo.apiName
            };
        });
    }

    get showTargetSelector() {
        return this.currentSelectedRecordId === null;
    }

    handleTargetSelection(event) {
        this.selectedTarget = event.target.value;
        this.refs.recordPicker.clearSelection();
    }

    handleRecordSelect(event) {
        this.currentSelectedRecordId = event.detail.recordId;
    }

    @wire(getObjectInfos, { objectApiNames: '$objectApiNames' })
    wiredGetObjectInfos({ error, data }) {
        if (error) {
            this.dispatchEvent(new CustomEvent('error', { error: error }));
            return;
        }

        if (!data) {
            return;
        }

        this.objectInfos = data.results.map((resultItem) => resultItem.result);
        this.isObjectInfoLoading = false;
    }
}
