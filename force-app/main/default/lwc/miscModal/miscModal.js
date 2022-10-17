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

    // If modal is closed with the standard X button, promise returns undefined
    // If modal is closed with the custom Close button, promise returns the value sent by the close method in myModal.js
    async handleShowModal() {
        this.result = await MyModal.open({
            size: 'small',
            description: 'MiscModal displays the message in a popup',
            header: this.header,
            content: this.content
        });
    }
}
