import { createElement } from 'lwc';
import RecordFormDynamicContact from 'c/recordFormDynamicContact';

describe('c-record-form-dynamic-contact', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders lightning-record-form with given input values', () => {
        const RECORD_FIELDS_INPUT = [
            'AccountId',
            'Name',
            'Title',
            'Phone',
            'Email'
        ];
        const RECORD_ID_INPUT = '0031700000pJRRSAA4';
        const OBJECT_API_NAME_INPUT = 'Contact';

        // Create initial element
        const element = createElement('c-record-form-dynamic-contact', {
            is: RecordFormDynamicContact
        });
        // Set public properties
        element.recordId = RECORD_ID_INPUT;
        element.objectApiName = OBJECT_API_NAME_INPUT;
        document.body.appendChild(element);

        // Validate if correct parameters have been passed to base components
        const formEl = element.shadowRoot.querySelector(
            'lightning-record-form'
        );
        expect(formEl.fields).toEqual(RECORD_FIELDS_INPUT);
        expect(formEl.recordId).toBe(RECORD_ID_INPUT);
        expect(formEl.objectApiName).toBe(OBJECT_API_NAME_INPUT);
    });

    it('is accessible', async () => {
        const element = createElement('c-record-form-dynamic-contact', {
            is: RecordFormDynamicContact
        });

        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });
});
