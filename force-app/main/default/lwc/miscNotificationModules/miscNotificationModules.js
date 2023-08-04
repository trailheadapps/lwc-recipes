import { LightningElement } from 'lwc';
import LightningAlert from 'lightning/alert';
import LightningConfirm from 'lightning/confirm';
import LightningPrompt from 'lightning/prompt';

export default class MiscNotificationModules extends LightningElement {
    confirmStatus;
    promptValue;

    async handleAlertClick() {
        await LightningAlert.open({
            message: 'This is an alert message',
            theme: 'info',
            label: 'Alert!'
        });
    }

    async handleConfirmClick() {
        const result = await LightningConfirm.open({
            message: 'this is the prompt message',
            variant: 'headerless',
            label: 'this is the aria-label value'
        });

        if (result) {
            this.confirmStatus = 'Ok was clicked';
        } else {
            this.confirmStatus = 'Cancel was clicked';
        }
    }

    async handlePromptClick() {
        // Returned value is input text if OK clicked or null if cancel was clicked
        this.promptValue = await LightningPrompt.open({
            message: 'Please enter a value',
            label: 'Please Respond',
            defaultValue: 'initial value',
            theme: 'shade'
        });
    }
}
