import { LightningElement, wire } from 'lwc';
import checkApexTypes from '@salesforce/apex/ApexTypesController.checkApexTypes';

export default class ApexImperativeMethodWithApexTypeParams extends LightningElement {
    listItemValue = 0;
    numberValue = 50;
    stringValue = 'Some string';

    parameterObject = {
        someString: this.stringValue,
        someInteger: this.numberValue,
        someList: []
    };

    @wire(checkApexTypes, { wrapper: '$parameterObject' })
    apexResponse;

    handleStringChange(event) {
        this.parameterObject.someString = this.stringValue = event.target.value;
    }

    handleNumberChange(event) {
        this.parameterObject.someInteger = this.numberValue =
            event.target.value;
    }

    handleListItemChange(event) {
        this.parameterObject.someList = [];
        for (let i = 0; i < event.target.value; i++) {
            this.parameterObject.someList.push({
                someInnerString: this.stringValue,
                someInnerInteger: this.numberValue
            });
        }
    }
}
