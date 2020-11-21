import { LightningElement } from 'lwc';

export default class HelloBinding extends LightningElement {
    greeting = 'Salesforce';

    handleChange(event) {
        this.greeting = event.target.value;
    }
}
