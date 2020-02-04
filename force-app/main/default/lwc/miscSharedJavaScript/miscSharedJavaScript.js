import { LightningElement } from 'lwc';
import { getTermOptions, calculateMonthlyPayment } from 'c/mortgage';

export default class MiscSharedJavaScript extends LightningElement {
    principal = 200000;
    term = 30;
    rate = 4;
    monthlyPayment = '';

    termOptions = getTermOptions();

    principalChange(event) {
        this.principal = event.target.value;
    }

    termChange(event) {
        this.term = parseInt(event.target.value, 10);
    }

    rateChange(event) {
        this.rate = event.target.value;
    }

    calculateMonthlyPayment() {
        this.monthlyPayment = calculateMonthlyPayment(
            this.principal,
            this.term,
            this.rate
        );
    }
}
