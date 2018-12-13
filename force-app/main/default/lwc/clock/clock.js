import { LightningElement, api, track } from 'lwc';

export default class Clock extends LightningElement {
    @track timestamp = new Date();

    @api
    refresh() {
        this.timestamp = new Date();
    }
}
