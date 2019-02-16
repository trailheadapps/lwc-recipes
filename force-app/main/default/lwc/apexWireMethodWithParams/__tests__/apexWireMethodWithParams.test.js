import { createElement } from 'lwc';
import ApexWireMethodWithParams from 'c/apexWireMethodWithParams';
import { registerApexTestWireAdapter } from '@salesforce/lwc-jest';
import findContacts from '@salesforce/apex/ContactController.findContacts';

// Realistic data with a list of contacts
const mockFindContacts = require('./data/findContacts.json');
// An empty list of records to verify the component does something reasonable
// when there is no data to display
const mockFindContactsNoRecords = require('./data/findContactsNoRecords.json');

// Register as an Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const findContactsAdapter = registerApexTestWireAdapter(findContacts);

describe('c-apex-wire-method-with-params', () => {
    beforeAll(() => {
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
        it('with one record', () => {
            const element = createElement('c-apex-wire-method-with-params', {
                is: ApexWireMethodWithParams
            });
            document.body.appendChild(element);

            const inputEl = element.shadowRoot.querySelector('lightning-input');
            inputEl.value = 'Amy';
            inputEl.dispatchEvent(new CustomEvent('change'));

            jest.runAllTimers();

            findContactsAdapter.emit(mockFindContacts);
            return Promise.resolve().then(() => {
                const detailEls = element.shadowRoot.querySelectorAll('p');
                expect(detailEls.length).toBe(1);
                expect(detailEls[0].textContent).toBe('Amy Taylor');
            });
        });

        it('with no record', () => {
            const element = createElement('c-apex-wire-method-with-params', {
                is: ApexWireMethodWithParams
            });
            document.body.appendChild(element);

            const inputEl = element.shadowRoot.querySelector('lightning-input');
            inputEl.value = 'does not exist';
            inputEl.dispatchEvent(new CustomEvent('change'));

            jest.runAllTimers();

            findContactsAdapter.emit(mockFindContactsNoRecords);
            return Promise.resolve().then(() => {
                const detailEls = element.shadowRoot.querySelectorAll('p');
                expect(detailEls.length).toBe(0);
            });
        });
    });

    describe('findContacts @wire error', () => {
        it('shows error panel element', () => {
            const element = createElement('c-apex-wire-method-with-params', {
                is: ApexWireMethodWithParams
            });
            document.body.appendChild(element);
            findContactsAdapter.error();
            return Promise.resolve().then(() => {
                const errorPanelEl = element.shadowRoot.querySelector(
                    'c-error-panel'
                );
                expect(errorPanelEl).not.toBeNull();
            });
        });
    });
});
