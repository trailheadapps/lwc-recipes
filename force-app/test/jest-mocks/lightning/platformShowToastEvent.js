/**
 * For the original lightning/platformShowToastEvent mock that comes by default with
 * @salesforce/sfdx-lwc-jest, see:
 * https://github.com/salesforce/sfdx-lwc-jest/blob/master/src/lightning-stubs/platformShowToastEvent/platformShowToastEvent.js
 */

export const ShowToastEventName = 'lightning__showtoast';

export class ShowToastEvent extends CustomEvent {
    constructor(toast) {
        super(ShowToastEventName, {
            composed: true,
            cancelable: true,
            bubbles: true,
            detail: toast
        });
    }
}
