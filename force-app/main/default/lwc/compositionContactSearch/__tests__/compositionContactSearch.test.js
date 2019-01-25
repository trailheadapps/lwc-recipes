import { createElement } from 'lwc';
import CompositionContactSearch from 'c/compositionContactSearch';
import findContacts from '@salesforce/apex/ContactController.findContacts';

jest.mock(
    '@salesforce/apex/ContactController.findContacts',
    () => {
        return {
            default: jest.fn()
        };
    },
    { virtual: true }
);

const APEX_CONTACTS_SUCCESS = [{ Id: '99', Name: 'Amy Taylor' }];
const APEX_CONTACTS_ERROR = {
    body: { message: 'An internal server error has occurred' },
    ok: false,
    status: 400,
    statusText: 'Bad Request'
};

describe('c-composition-contact-search', () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise timing when calling Apex
    function flushPromises() {
        // eslint-disable-next-line no-undef
        return new Promise(resolve => setImmediate(resolve));
    }

    it('renders one contact tile based on user input', () => {
        findContacts.mockResolvedValue(APEX_CONTACTS_SUCCESS);

        // Create initial element
        const element = createElement('c-composition-contact-search', {
            is: CompositionContactSearch
        });
        document.body.appendChild(element);

        // Query lightning-input field element
        const inputFieldEl = element.shadowRoot.querySelector(
            'lightning-input'
        );
        inputFieldEl.value = 'Amy';
        inputFieldEl.dispatchEvent(new CustomEvent('change'));

        jest.runAllTimers();

        // Return an immediate flushed promise (after the Apex call) to then
        // wait for any asynchronous DOM updates. Jest will automatically wait
        // for the Promise chain to complete before ending the test and fail
        // the test if the promise ends in the rejected state
        return flushPromises().then(() => {
            const contactTile = element.shadowRoot.querySelector(
                'c-contact-tile'
            );
            expect(contactTile).not.toBeNull();
            expect(contactTile.contact.Name).toBe('Amy Taylor');
        });
    });

    it('renders the error panel when the Apex method returns an error', () => {
        findContacts.mockRejectedValue(APEX_CONTACTS_ERROR);

        // Create initial element
        const element = createElement('c-composition-contact-search', {
            is: CompositionContactSearch
        });
        document.body.appendChild(element);

        // Query lightning-input field elements
        const inputFieldEl = element.shadowRoot.querySelector(
            'lightning-input'
        );
        inputFieldEl.value = 'invalid';
        inputFieldEl.dispatchEvent(new CustomEvent('change'));

        jest.runAllTimers();

        // Return an immediate flushed promise (after the Apex call) to then
        // wait for any asynchronous DOM updates. Jest will automatically wait
        // for the Promise chain to complete before ending the test and fail
        // the test if the promise ends in the rejected state
        return flushPromises().then(() => {
            const errorPanelEl = element.shadowRoot.querySelector(
                'c-error-panel'
            );
            expect(errorPanelEl).not.toBeNull();
        });
    });
});
