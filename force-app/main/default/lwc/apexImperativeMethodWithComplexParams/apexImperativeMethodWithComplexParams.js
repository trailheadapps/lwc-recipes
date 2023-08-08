import { LightningElement } from 'lwc';
import checkApexTypes from '@salesforce/apex/ApexTypesController.checkApexTypes';

export default class ApexImperativeMethodWithComplexParams extends LightningElement {
    listItemValue = 4;
    numberValue = 50;
    stringValue = 'Some string';

    message;
    error;

    handleStringChange(event) {
        this.stringValue = event.target.value;
    }

    handleNumberChange(event) {
        this.numberValue = event.target.value;
    }

    handleListItemChange(event) {
        this.listItemValue = event.target.value;
    }

    async handleButtonClick() {
        // Creating the object that represents the shape
        // of the Apex wrapper class.
        let parameterObject = {
            someString: this.stringValue,
            someInteger: this.numberValue,
            someList: []
        };
        // Populating a list
        for (let i = 0; i < this.listItemValue; i++) {
            parameterObject.someList.push(this.stringValue);
        }

        // Calling the imperative Apex method with the JSON
        // object as parameter.
        try {
            this.message = await checkApexTypes({ wrapper: parameterObject });
            this.error = undefined;
        } catch (error) {
            this.message = undefined;
            this.error = error;
        }
    }
}
