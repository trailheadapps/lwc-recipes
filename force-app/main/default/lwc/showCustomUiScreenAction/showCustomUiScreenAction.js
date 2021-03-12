import { LightningElement, api } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';

export default class ShowCustomUiScreenAction extends LightningElement {
    @api recordId;

    handleOK() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }
}
