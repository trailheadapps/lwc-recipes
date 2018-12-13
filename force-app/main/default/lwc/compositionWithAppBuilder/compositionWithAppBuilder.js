import { LightningElement, api } from 'lwc';

export default class CompositionWithAppBuilder extends LightningElement {
    @api picklistValue;
    @api stringValue;
    @api numberValue;
}
