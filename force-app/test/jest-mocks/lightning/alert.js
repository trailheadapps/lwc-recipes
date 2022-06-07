import { LightningElement, api } from 'lwc';

export default class Alert extends LightningElement {
    static open() {
        throw new Error(
            'The LightningAlert documentation contains examples for mocking .open in Jest'
        );
    }
    @api label;
    @api message;
    @api theme;
    @api variant;
}
