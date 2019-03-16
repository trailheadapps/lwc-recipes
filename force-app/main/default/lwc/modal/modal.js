import { LightningElement, api, track } from 'lwc';

const CSS_CLASS = 'modal-hidden';

export default class Modal extends LightningElement {
    @api header = '';

    @track hasHeaderString = false;

    connectedCallback() {
        if (this.header !== '') {
            this.hasHeaderString = true;
        }
    }

    @api show() {
        const outerDivEl = this.template.querySelector('div');
        outerDivEl.classList.remove(CSS_CLASS);
    }

    @api hide() {
        const outerDivEl = this.template.querySelector('div');
        outerDivEl.classList.add(CSS_CLASS);
    }

    handleDialogClose() {
        this.hide();
    }

    handleSlotTaglineChange() {
        const taglineEl = this.template.querySelector('p');
        taglineEl.classList.remove(CSS_CLASS);
    }

    handleSlotFooterChange() {
        const footerEl = this.template.querySelector('footer');
        footerEl.classList.remove(CSS_CLASS);
    }
}
