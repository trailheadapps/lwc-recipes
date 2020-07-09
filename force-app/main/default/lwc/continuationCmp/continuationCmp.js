import { LightningElement, track, wire } from 'lwc';
import startRequest from '@salesforce/apexContinuation/SampleContinuationClass.startRequest';
export default class ContinuationComponent extends LightningElement {
    @track imperativeContinuation = {};

    // Using wire service
    @wire(startRequest)
    wiredContinuation;

    get formattedWireResult() {
        return JSON.stringify(this.wiredContinuation);
    }

    // Imperative Call
    callContinuation() {
        startRequest()
            .then((result) => {
                this.imperativeContinuation = result;
            })
            .catch((error) => {
                this.imperativeContinuation = error;
            });
    }

    get formattedImperativeResult() {
        return JSON.stringify(this.imperativeContinuation);
    }
}
