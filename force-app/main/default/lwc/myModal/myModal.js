import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class MyModal extends LightningModal {
    @api header;
    @api content;

    // Return a custom value when the modal is closed with the Close button.
    // If no value is returned in the close method, then undefined is returned(Same as closing with the X button).
    handleClose() {
        this.close('return value');
    }
}
