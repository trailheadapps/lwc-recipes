import { LightningElement, track } from 'lwc';

export default class EventSimple extends LightningElement {
    @track page = 1;

    handlePrevious() {
        if (this.page > 1) {
            this.page = this.page - 1;
        }
    }

    handleNext() {
        this.page = this.page + 1;
    }
}
