import { LightningElement } from 'lwc';
import MyModal from 'c/myModal';

export default class MiscModal extends LightningElement {
    content = 'The modal content';
    header = 'The modal header';

    handleHeaderChange(event) {
        this.header = event.target.value;
    }

    handleContentChange(event) {
        this.content = event.target.value;
    }

    // if modal closed with X button or Cancel button, promise returns result = 'undefined'
    // if modal closed with Close button, promise returns result = 'close'
    // You can use the result value for further processing
    async handleShowModal() {
        this.result = await MyModal.open({
            size: 'small',
            description: 'MiscModal displays the message in a popup',
            header: this.header,
            content: this.content
        });
    }
}
