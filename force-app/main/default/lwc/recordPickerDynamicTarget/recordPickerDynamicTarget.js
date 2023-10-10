import { wire, LightningElement, api } from 'lwc';
import { getObjectInfos } from 'lightning/uiObjectInfoApi';

export default class RecordPickerDynamicTarget extends LightningElement {
    placeholder = 'Search';

    @api
    label = 'Record Picker';

    objectApiNames = ['Account', 'Case', 'Contact'];
    currentObjectApiName = 'Account';
    objectInfos = [];
    isObjectInfoLoading = true;

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
        return this.displayInfos
            ? this.displayInfos[this.currentObjectApiName]
            : undefined;
    }

    get matchingInfo() {
        return this.matchingInfos
            ? this.matchingInfos[this.currentObjectApiName]
            : undefined;
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

    handleTargetSelection(event) {
        this.currentObjectApiName = event.target.value;
        this.refs.recordPicker.clearSelection();
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

        this.objectInfos = [];
        data.results.forEach((result) => {
            const objectInfo = result.result;
            this.objectInfos.push(objectInfo);
        });
        this.isObjectInfoLoading = false;
    }
}