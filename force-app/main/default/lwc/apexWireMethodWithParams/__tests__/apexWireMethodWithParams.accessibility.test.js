import { createElement } from 'lwc';
import ApexWireMethodWithParams from 'c/apexWireMethodWithParams';
import findContacts from '@salesforce/apex/ContactController.findContacts';

// Realistic data with a list of contacts
const mockFindContacts = require('./data/findContacts.json');

// Mock Apex wire adapter
jest.mock(
    '@salesforce/apex/ContactController.findContacts',
    () => {
        const {
            createApexTestWireAdapter
        } = require('@salesforce/sfdx-lwc-jest');
        return {
            default: createApexTestWireAdapter(jest.fn())
        };
    },
    { virtual: true }
);

describe('c-apex-wire-method-with-params-accessibility', () => {
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

    it('is accessible when data is returned', async () => {
        // Create component
        const element = createElement('c-apex-wire-method-with-params', {
            is: ApexWireMethodWithParams
        });
        document.body.appendChild(element);

        // Emit data from @wire
        findContacts.emit(mockFindContacts);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });

    it('is accessible when error is returned', async () => {
        // Create component
        const element = createElement('c-apex-wire-method-with-params', {
            is: ApexWireMethodWithParams
        });
        document.body.appendChild(element);

        // Emit error from @wire
        findContacts.error();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
