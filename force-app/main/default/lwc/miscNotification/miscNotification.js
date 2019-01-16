import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class MiscNotification extends LightningElement {
    @track titleText = 'Sample Title';
    @track messageText = 'Sample Message';
    @track variant = 'error';
    variantOptions = [
        { label: 'error', value: 'error' },
        { label: 'warning', value: 'warning' },
        { label: 'success', value: 'success' },
        { label: 'info', value: 'info' }
    ];

    titleChange(event) {
        this.titleText = event.target.value;
    }

    messageChange(event) {
        this.messageText = event.target.value;
    }

    variantChange(event) {
        this.variant = event.target.value;
    }

    showNotification() {
        const evt = new ShowToastEvent({
            title: this.titleText,
            message: this.messageText,
            variant: this.variant
        });
        this.dispatchEvent(evt);
    }
}
