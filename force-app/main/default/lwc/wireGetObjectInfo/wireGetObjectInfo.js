import { LightningElement, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

export default class WireGetObjectInfo extends LightningElement {
    objectApiName;

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    objectInfo;

    handleBtnClick() {
        this.objectApiName = this.template.querySelector(
            'lightning-input'
        ).value;
    }

    get objectInfoStr() {
        return this.objectInfo
            ? JSON.stringify(this.objectInfo.data, null, 2)
            : '';
    }
}
