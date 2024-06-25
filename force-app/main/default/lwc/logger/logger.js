import { LightningElement } from "lwc";

//This is the new library function required
import { log } from 'lightning/logger';

export default class Egelwclogger extends LightningElement {
    logMessageEventMonitoring() {
        let msg = {
            type: "click",
            action: "Approve"
        }
        log('Message sent to the Salesforce Event Monitoring and the console' + msg);
    }
    logMessageConsole() {
        console.log('This message appears in the browser console');
    }
}