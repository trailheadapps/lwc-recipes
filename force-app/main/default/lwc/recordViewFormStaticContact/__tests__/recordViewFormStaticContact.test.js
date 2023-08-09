import { createElement } from 'lwc';
import RecordViewFormStaticContact from 'c/recordViewFormStaticContact';

describe('c-record-view-form-static-contact', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders lightning-record-view-form with given input values', () => {
        const RECORD_ID_INPUT = '0031700000pJRRSAA4';
        const OBJECT_API_NAME_INPUT = 'Contact';

        // Create component
        const element = createElement('c-record-view-form-static-contact', {
            is: RecordViewFormStaticContact
        });
        // Set public properties
        element.recordId = RECORD_ID_INPUT;
        element.objectApiName = OBJECT_API_NAME_INPUT;
        document.body.appendChild(element);

        // Validate if correct parameters have been passed to base components
        const formEl = element.shadowRoot.querySelector(
            'lightning-record-view-form'
        );
        expect(formEl.recordId).toBe(RECORD_ID_INPUT);
        expect(formEl.objectApiName).toBe(OBJECT_API_NAME_INPUT);
    });

    it('renders given set of lightning-output-field`s in specific order', () => {
        const OUTPUT_FIELDS = [
            {
                fieldApiName: 'AccountId',
                objectApiName: 'Contact'
            },
            {
                fieldApiName: 'Name',
                objectApiName: 'Contact'
            },
            {
                fieldApiName: 'Title',
                objectApiName: 'Contact'
            },
            {
                fieldApiName: 'Phone',
                objectApiName: 'Contact'
            },
            {
                fieldApiName: 'Email',
                objectApiName: 'Contact'
            }
        ];
        const RECORD_ID_INPUT = '0031700000pJRRSAA4';
        const OBJECT_API_NAME_INPUT = 'Contact';

        // Create component
        const element = createElement('c-record-view-form-static-contact', {
            is: RecordViewFormStaticContact
        });
        // Set public properties
        element.recordId = RECORD_ID_INPUT;
        element.objectApiName = OBJECT_API_NAME_INPUT;
        document.body.appendChild(element);

        // Select elements for validation
        const outputFieldNames = Array.from(
            element.shadowRoot.querySelectorAll('lightning-output-field')
        ).map((outputField) => outputField.fieldName);
        expect(outputFieldNames).toEqual(OUTPUT_FIELDS);
    });

    it('is accessible', async () => {
        const element = createElement('c-record-view-form-static-contact', {
            is: RecordViewFormStaticContact
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
