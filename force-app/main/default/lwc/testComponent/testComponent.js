import { LightningElement } from 'lwc';

export default class TestComponent extends LightningElement {
    player = '';

    handleChange(event) {
        this.player = event.target.value;
    }
}