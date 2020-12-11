import { LightningElement, wire } from 'lwc';
import checkApexTypes from '@salesforce/apex/ApexTypesController.checkApexTypes';

export default class ApexWireMethodWithComplexParams extends LightningElement {
    numberValue = 50;
    stringValue = 'Some string';
    listValues = [];

    listOptions = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
        { value: '3', label: 'Option 3' },
        { value: '4', label: 'Option 4' },
        { value: '5', label: 'Option 5' }
    ];

    parameterObject = {
        someString: this.stringValue,
        someInteger: this.numberValue,
        someList: this.listValues
    };

    @wire(checkApexTypes, { wrapper: '$parameterObject' })
    apexResponse;

    handleStringChange(event) {
        this.parameterObject = {
            ...this.parameterObject,
            someString: (this.stringValue = event.target.value)
        };
    }

    handleNumberChange(event) {
        this.parameterObject = {
            ...this.parameterObject,
            someInteger: (this.numberValue = parseInt(event.target.value, 10))
        };
    }

    handleListOptionChange(event) {
        this.parameterObject = {
            ...this.parameterObject,
            someList: (this.listValues = event.detail.value)
        };
    }
}
