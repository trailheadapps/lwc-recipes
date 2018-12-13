import { LightningElement, track } from 'lwc';

export default class ApiProperty extends LightningElement {
    @track percentage = 50;

    handlePercentageChange(event) {
        this.percentage = event.target.value;
    }
}
