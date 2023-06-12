import { LightningElement, api } from 'lwc';

export default class Child extends LightningElement {
    @api firstName;
    @api lastName;

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}
