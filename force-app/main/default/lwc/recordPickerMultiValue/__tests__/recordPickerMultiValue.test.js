import { createElement } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import RecordPickerMultiValue from 'c/recordPickerMultiValue';
// import { graphql } from 'lightning/uiGraphQLApi';

// Mock realistic data
// const mockGraphQL = require('./data/graphqlContactResult.json');
// const mockGraphQLEmptyResults = require('./data/graphqlContactEmptyResult.json');

// Mock realistic data
const mockGetRecord = require('./data/wireGetRecordResponse.json');
describe('recordPickerMultiValue', () => {
    let element;
    beforeEach(() => {
        // Create component
        element = createElement('c-record-picker-multi-value', {
            is: RecordPickerMultiValue
        });
        element.objectApiName = 'Contact';
        element.label = 'Contact';
        document.body.appendChild(element);
    });

    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.
    async function flushPromises() {
        return Promise.resolve();
    }

    it('renders a lightning-record-picker component', () => {
        const recordPickerElement = element.shadowRoot.querySelector(
            'lightning-record-picker'
        );
        expect(recordPickerElement).toBeTruthy();
    });

    it('is accessible', async () => {
        expect(element).toBeAccessible();
    });

    it('should display the selected record as a pill under the input component', async () => {
        // set selected record
        const recordPickerElement = element.shadowRoot.querySelector(
            'lightning-record-picker'
        );

        // Simulate a record selection in the record picker
        recordPickerElement.dispatchEvent(
            new CustomEvent('change', {
                detail: { recordId: '005xx000001X83aAAC' }
            })
        );

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Emit data from @wire
        getRecord.emit(mockGetRecord);

        // Wait for any asynchronous wire call
        await flushPromises();

        const pillContainer = element.shadowRoot.querySelector(
            'lightning-pill-container'
        );

        expect(pillContainer.items).toEqual([
            {
                name: '005xx000001X83aAAC',
                label: 'Bob',
                iconName: 'standard:contact'
            }
        ]);
    });
});
