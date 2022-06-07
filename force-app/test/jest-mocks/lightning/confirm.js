import { LightningElement, api } from 'lwc';

export default class Confirm extends LightningElement {
    static open() {
        throw new Error(
            'The LightningConfirm documentation contains examples for mocking .open in Jest'
        );
    }
    @api label;
    @api message;
    @api theme;
    @api variant;
}
