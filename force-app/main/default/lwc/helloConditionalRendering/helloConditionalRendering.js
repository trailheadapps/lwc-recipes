import { LightningElement } from 'lwc';

export default class HelloConditionalRendering extends LightningElement {
    areDetailsVisible = false;

    handleChange(event) {
        this.areDetailsVisible = event.target.checked;
    }
}
