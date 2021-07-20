/**
 * Accessibility tests reside in a different test file in this case
 * because there's an open issue on jest (https://github.com/facebook/jest/issues/8726)
 * because of which fake timers leak into all the tests in the same file,
 * while Axe doen't work when using fake timers.
 **/
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

describe('c-apex-wire-method-with-params', () => {
    beforeAll(() => {
        // We use fake timers as setTimeout is used in the JavaScript file.
        jest.useFakeTimers();
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

    describe('findContacts @wire data', () => {
        it('gets called with data from user input', async () => {
            const USER_INPUT = 'Amy';
            const WIRE_PARAMETER = { searchKey: USER_INPUT };

            // Create initial element
            const element = createElement('c-apex-wire-method-with-params', {
                is: ApexWireMethodWithParams
            });
            document.body.appendChild(element);

            // Select input field for simulating user input
            const inputEl = element.shadowRoot.querySelector('lightning-input');
            inputEl.value = USER_INPUT;
            inputEl.dispatchEvent(new CustomEvent('change'));

            // Run all fake timers.
            jest.runAllTimers();

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Validate parameters of @wire
            expect(findContacts.getLastConfig()).toEqual(WIRE_PARAMETER);
        });

        it('renders data of one record', async () => {
            const USER_INPUT = 'Amy';

            // Create initial element
            const element = createElement('c-apex-wire-method-with-params', {
                is: ApexWireMethodWithParams
            });
            document.body.appendChild(element);

            // Select input field for simulating user input
            const inputEl = element.shadowRoot.querySelector('lightning-input');
            inputEl.value = USER_INPUT;
            inputEl.dispatchEvent(new CustomEvent('change'));

            // Run all fake timers.
            jest.runAllTimers();

            // Emit data from @wire
            findContacts.emit(mockFindContacts);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Select elements for validation
            const detailEls = element.shadowRoot.querySelectorAll('p');
            expect(detailEls.length).toBe(mockFindContacts.length);
            expect(detailEls[0].textContent).toBe(mockFindContacts[0].Name);
        });
    });

    describe('findContacts @wire error', () => {
        it('shows error panel element', async () => {
            // Create initial element
            const element = createElement('c-apex-wire-method-with-params', {
                is: ApexWireMethodWithParams
            });
            document.body.appendChild(element);

            // Emit error from @wire
            findContacts.error();

            // Wait for any asynchronous DOM updates
            await flushPromises();

            const errorPanelEl =
                element.shadowRoot.querySelector('c-error-panel');
            expect(errorPanelEl).not.toBeNull();
        });
    });
});
