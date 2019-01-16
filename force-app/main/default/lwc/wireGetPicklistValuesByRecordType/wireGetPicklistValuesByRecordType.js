import { LightningElement, wire, track } from 'lwc';
import { getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import ACCOUNT_RECORD from '@salesforce/schema/Account';

export default class WireGetPicklistValuesByRecordType extends LightningElement {
    @track treeModel;
    @track error;

    @wire(getPicklistValuesByRecordType, {
        objectApiName: ACCOUNT_RECORD,
        recordTypeId: '012000000000000AAA'
    })
    wiredValues({ error, data }) {
        if (data) {
            this.treeModel = this.buildTreeModel(data.picklistFieldValues);
            this.error = undefined;
        } else {
            this.error = error;
            this.treeModel = undefined;
        }
    }

    buildTreeModel(picklistValues) {
        const treeNodes = [];
        Object.keys(picklistValues).forEach(picklist => {
            treeNodes.push({
                label: picklist,
                items: picklistValues[picklist].values.map(item => ({
                    label: item.label,
                    name: item.value
                }))
            });
        });
        return treeNodes;
    }
}
