import { createElement } from 'lwc';
import RecordPickerHello from 'c/recordPickerHello';
import { graphql } from 'lightning/uiGraphQLApi';

// Mock realistic data
// import mockGraphQL from '../data/graphqlContactResult.json';
const mockGraphQL = require('../data/graphqlContactResult.json');

describe('recordPickerHello', () => {
    let element;
    beforeEach(() => {
        // Create component
        element = createElement('c-record-picker-hello', {
            is: RecordPickerHello
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

    it('changes the target object of the record picker', async () => {
        // set selected record
        const recordPickerElement = element.shadowRoot.querySelector(
            'lightning-record-picker'
        );
        recordPickerElement.value = '003Z70000016iOUIAY';
        recordPickerElement.dispatchEvent(new CustomEvent('change'));
        // Emit data from @wire
        graphql.emit(mockGraphQL);

        // Wait for any asynchronous DOM updates
        await flushPromises();
        const selectedRecordDetails = element.shadowRoot.querySelector(
            '.selectedRecordDetails'
        );
        await flushPromises();

        console.log(selectedRecordDetails);

        expect(selectedRecordDetails).toBeTruthy();
    });
});
