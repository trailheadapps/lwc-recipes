import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class DispatchEventHeadlessAction extends LightningElement {
    @api recordId;
    @api async invoke() {
        // Fire Toast message
        let event = new ShowToastEvent({
            title: 'I am a headless action!',
            message: 'Hi there! Starting...'
        });
        this.dispatchEvent(event);
        // Wait and fire another another Toast message
        await this.sleep(2000);
        // Fire Toast message
        event = new ShowToastEvent({
            title: 'I am a headless action on record with id ' + this.recordId,
            message: 'All done!'
        });
        this.dispatchEvent(event);
    }

    sleep(ms) {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
