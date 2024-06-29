import { LightningElement } from 'lwc';
import { log } from 'lightning/logger';

export default class MiscLogger extends LightningElement {
    logMessageEventMonitoring() {
        let msg = {
            type: 'click',
            action: 'Log'
        };
        log(msg);
    }
    logMessageConsole() {
        console.log('This message is logged to the console');
    }
}
