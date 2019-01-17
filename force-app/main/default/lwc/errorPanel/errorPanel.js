import { LightningElement, api, track } from 'lwc';

export default class ErrorPanel extends LightningElement {
    /** Generic / user-friendly message */
    @api friendlyMessage = 'Error retrieving data';

    @track viewDetails = false;

    _errors;

    @api
    get errors() {
        return this._errors;
    }
    /** Single error object or array of error objects */
    set errors(value) {
        if (!Array.isArray(value)) {
            value = [value];
        }
        // Filter out null items and error objects that don't have a message attribute.
        // As a convenience, a component can pass all its @wired properties .error references even if they are null,
        // moving the burden of filtering from each individual component to this central location.
        this._errors = value.filter(error => error && error.message);
    }

    handleCheckboxChange(event) {
        this.viewDetails = event.target.checked;
    }
}
