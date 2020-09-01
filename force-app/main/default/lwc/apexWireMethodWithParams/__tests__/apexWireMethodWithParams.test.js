import { createElement } from 'lwc';
import ApexWireMethodWithParams from 'c/apexWireMethodWithParams';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import findContacts from '@salesforce/apex/ContactController.findContacts';

// Realistic data with a list of contacts
const mockFindContacts = require('./data/findContacts.json');

// An empty list of records to verify the component does something reasonable
// when there is no data to display
const mockFindContactsNoRecords = require('./data/findContactsNoRecords.json');

// Register as Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const findContactsAdapter = registerApexTestWireAdapter(findContacts);

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

    describe('findContacts @wire data', () => {
        it('gets called with data from user input', () => {
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

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                // Validate parameters of wire adapter
                expect(findContactsAdapter.getLastConfig()).toEqual(
                    WIRE_PARAMETER
                );
            });
        });

        it('renders data of one record', () => {
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
            findContactsAdapter.emit(mockFindContacts);

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                // Select elements for validation
                const detailEls = element.shadowRoot.querySelectorAll('p');
                expect(detailEls.length).toBe(mockFindContacts.length);
                expect(detailEls[0].textContent).toBe(mockFindContacts[0].Name);
            });
        });

        it('renders no items when no record is available', () => {
            const USER_INPUT = 'does not exist';

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
            findContactsAdapter.emit(mockFindContactsNoRecords);

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                const detailEls = element.shadowRoot.querySelectorAll('p');
                expect(detailEls.length).toBe(mockFindContactsNoRecords.length);
            });
        });
    });

    describe('findContacts @wire error', () => {
        it('shows error panel element', () => {
            // Create initial element
            const element = createElement('c-apex-wire-method-with-params', {
                is: ApexWireMethodWithParams
            });
            document.body.appendChild(element);

            // Emit error from @wire
            findContactsAdapter.error();

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                const errorPanelEl = element.shadowRoot.querySelector(
                    'c-error-panel'
                );
                expect(errorPanelEl).not.toBeNull();
            });
        });
    });
});
