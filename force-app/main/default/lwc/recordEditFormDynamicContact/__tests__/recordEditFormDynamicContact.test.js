import { createElement } from 'lwc';
import RecordEditFormDynamicContact from 'c/recordEditFormDynamicContact';

describe('c-record-edit-form-dynamic-contact', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders lightning-record-edit-form with given input values', () => {
        const RECORD_ID_INPUT = '0031700000pJRRSAA4';
        const OBJECT_API_NAME_INPUT = 'Contact';

        // Create initial element
        const element = createElement('c-record-edit-form-dynamic-contact', {
            is: RecordEditFormDynamicContact
        });
        // Set public properties
        element.recordId = RECORD_ID_INPUT;
        element.objectApiName = OBJECT_API_NAME_INPUT;
        document.body.appendChild(element);

        // Validate if correct parameters have been passed to base components
        const formEl = element.shadowRoot.querySelector(
            'lightning-record-edit-form'
        );
        expect(formEl.recordId).toBe(RECORD_ID_INPUT);
        expect(formEl.objectApiName).toBe(OBJECT_API_NAME_INPUT);

        // Validate if submit button is defined
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        expect(buttonEl.type).toBe('submit');
        expect(buttonEl.label).toBe('Save');
    });

    it('renders given set of lightning-output-field`s in specific order', () => {
        const INPUT_FIELDS = ['AccountId', 'Name', 'Title', 'Phone', 'Email'];
        const RECORD_ID_INPUT = '0031700000pJRRSAA4';
        const OBJECT_API_NAME_INPUT = 'Contact';

        // Create initial element
        const element = createElement('c-record-edit-form-dynamic-contact', {
            is: RecordEditFormDynamicContact
        });
        // Set public properties
        element.recordId = RECORD_ID_INPUT;
        element.objectApiName = OBJECT_API_NAME_INPUT;
        document.body.appendChild(element);

        // Select elements for validation
        const outputFieldNames = Array.from(
            element.shadowRoot.querySelectorAll('lightning-input-field')
        ).map((outputField) => outputField.fieldName);
        expect(outputFieldNames).toEqual(INPUT_FIELDS);
    });
});
