import { LightningElement, api } from 'lwc';

export default class Modal extends LightningElement {
    showModal = false;
    hasHeaderString = false;
    _headerPrivate;

    @api
    set header(value) {
        this.hasHeaderString = value !== '';
        this._headerPrivate = value;
    }
    get header() {
        return this._headerPrivate;
    }

    @api show() {
        this.showModal = true;
    }

    @api hide() {
        this.showModal = false;
    }

    handleDialogClose() {
        //Let parent know that dialog is closed (mainly by that cross button) so it can set proper variables if needed
        this.dispatchEvent(new CustomEvent('closedialog'));
        this.hide();
    }

    handleSlotTaglineChange() {
        this.showElement('p');
    }

    handleSlotFooterChange() {
        this.showElement('footer');
    }

    showElement(htmlTag) {
        this.template.querySelector(htmlTag)?.classList?.remove('modal-hidden');
    }
}
