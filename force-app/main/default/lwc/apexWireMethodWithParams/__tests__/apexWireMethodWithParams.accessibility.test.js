import { createElement } from 'lwc';
import ApexWireMethodWithParams from 'c/apexWireMethodWithParams';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import findContacts from '@salesforce/apex/ContactController.findContacts';

// Realistic data with a list of contacts
const mockFindContacts = require('./data/findContacts.json');

// Register as Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const findContactsAdapter = registerApexTestWireAdapter(findContacts);

describe('c-apex-wire-method-with-params-accessibility', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    it('is accessible when data is returned', () => {
        // Create initial element
        const element = createElement('c-apex-wire-method-with-params', {
            is: ApexWireMethodWithParams
        });

        document.body.appendChild(element);

        // Emit data from @wire
        findContactsAdapter.emit(mockFindContacts);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });

    it('is accessible when error is returned', () => {
        // Create initial element
        const element = createElement('c-apex-wire-method-with-params', {
            is: ApexWireMethodWithParams
        });

        document.body.appendChild(element);

        // Emit error from @wire
        findContactsAdapter.error();

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });
});
