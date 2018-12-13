import { LightningElement } from 'lwc';

export default class Paginator extends LightningElement {
    handlePrevious() {
        this.dispatchEvent(new CustomEvent('previous'));
    }

    handleNext() {
        this.dispatchEvent(new CustomEvent('next'));
    }
}
