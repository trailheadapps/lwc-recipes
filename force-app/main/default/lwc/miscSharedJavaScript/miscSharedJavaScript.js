import { LightningElement, track } from 'lwc';
import { getTermOptions, calculateMonthlyPayment } from 'c/mortgage';

export default class MiscSharedJavaScript extends LightningElement {
    @track principal = 200000;
    @track term = 30;
    @track rate = 4;
    @track monthlyPayment = '';

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
