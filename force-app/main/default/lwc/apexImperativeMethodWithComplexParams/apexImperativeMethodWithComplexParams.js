import { LightningElement } from 'lwc';
import checkApexTypes from '@salesforce/apex/ApexTypesController.checkApexTypes';

export default class ApexImperativeMethodWithComplexParams extends LightningElement {
    listValue = [];
    numberValue = 50;
    stringValue = 'Some string';

    listOptions = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
        { value: '3', label: 'Option 3' },
        { value: '4', label: 'Option 4' },
        { value: '5', label: 'Option 5' }
    ];

    message;
    error;

    handleStringChange(event) {
        this.stringValue = event.target.value;
    }

    handleNumberChange(event) {
        this.numberValue = event.target.value;
    }

    handleListOptionChange(event) {
        this.listValue = event.detail.value;
    }

    handleButtonClick() {
        // Creating the object that represents the shape
        // of the Apex wrapper class.
        let parameterObject = {
            someString: this.stringValue,
            someInteger: this.numberValue,
            someList: this.listValue
        };

        // Calling the imperative Apex method with the JSON
        // object as parameter.
        checkApexTypes({ wrapper: parameterObject })
            .then((result) => {
                this.message = result;
                this.error = undefined;
            })
            .catch((error) => {
                this.message = undefined;
                this.error = error;
            });
    }
}
