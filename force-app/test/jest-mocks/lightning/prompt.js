import { LightningElement, api } from 'lwc';

export default class Prompt extends LightningElement {
    static open() {
        throw new Error(
            'The LightningPrompt documentation contains examples for mocking .open in Jest'
        );
    }
    @api defaultValue;
    @api label;
    @api message;
    @api theme;
    @api variant;
}
