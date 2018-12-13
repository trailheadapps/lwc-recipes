import { LightningElement, track } from 'lwc';

export default class HelloConditionalRendering extends LightningElement {
    @track areDetailsVisible = false;

    handleChange(event) {
        this.areDetailsVisible = event.target.checked;
    }
}
