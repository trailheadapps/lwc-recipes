import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { RefreshEvent } from 'lightning/refresh';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import TYPE_FIELD from '@salesforce/schema/Account.Type';

export default class DispatchRefreshEvent extends LightningElement {
    // Exposing fields to make them available in the template
    nameField = NAME_FIELD;
    phoneField = PHONE_FIELD;
    typeField = TYPE_FIELD;

    handleSuccess(event) {
        // Show Account Created Successfully message
        const evt = new ShowToastEvent({
            title: 'Account created',
            message: 'Record ID: ' + event.detail.id,
            variant: 'success'
        });
        this.dispatchEvent(evt);

        // Dispatch the refresh event
        this.dispatchEvent(new RefreshEvent());

        // Reset the fields to create a new record
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        inputFields?.forEach((field) => field.reset());
    }
}
