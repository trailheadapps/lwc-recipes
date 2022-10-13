import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class MyModal extends LightningModal {
    @api header;
    @api content;

    //This is same as closing the modal with the default close button, the X at the top right corner
    handleCancel() {
        this.close();
    }

    handleClose() {
        this.close('close');
    }
}
