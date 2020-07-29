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

    handleButtonClick() {
        // Creating the object that represents the shape
        // of the Apex wrapper class.
        let parameterObject = {
            someString: this.stringValue,
            someInteger: this.numberValue,
            someList: []
        };
        // Populating a list
        for (let i = 0; i < this.listItemValue; i++) {
            parameterObject.someList.push({
                someInnerString: this.stringValue,
                someInnerInteger: this.numberValue
            });
        }

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
