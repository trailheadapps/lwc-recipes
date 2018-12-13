import { LightningElement, wire, track } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

export default class WireGetObjectInfo extends LightningElement {
    objectApiNameInputValue = 'Account';
    objectApiName;
    @track objectInfo;

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    objectInfo;

    objectNameChange(event) {
        this.objectApiNameInputValue = event.target.value;
    }

    handleBtnClick() {
        this.objectApiName = this.objectApiNameInputValue;
    }

    get objectInfoStr() {
        return this.objectInfo
            ? JSON.stringify(this.objectInfo.data, null, 2)
            : '';
    }
}
