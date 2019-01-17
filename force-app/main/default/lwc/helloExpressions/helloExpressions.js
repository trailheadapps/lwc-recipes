import { LightningElement, track } from 'lwc';

export default class HelloExpressions extends LightningElement {
    @track firstName = '';
    @track lastName = '';

    handleChange(event) {
        const field = event.target.name;
        if (field === 'firstName') {
            this.firstName = event.target.value;
        } else if (field === 'lastName') {
            this.lastName = event.target.value;
        }
    }

    get uppercasedFullName() {
        return `${this.firstName} ${this.lastName}`.trim().toUpperCase();
    }
}
