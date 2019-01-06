import { createElement } from 'lwc';
import CompositionContactSearch from 'c/compositionContactSearch';
import findContacts from '@salesforce/apex/ContactController.findContacts';

const mockFindContacts = jest.mock(
    '@salesforce/apex/ContactController.findContacts',
    () => {
        return {
            default: jest.fn()
        };
    },
    { virtual: true }
);

describe('c-composition-contact-search', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders one lightning-input field labelled "Search"', () => {
        // Create initial element
        const element = createElement('c-composition-contact-search', {
            is: CompositionContactSearch
        });
        document.body.appendChild(element);
        // Query lightning-input field elements
        const inputFieldEls = element.shadowRoot.querySelectorAll(
            'lightning-input'
        );
        // Check length of rendered lightning-input elements
        expect(inputFieldEls.length).toBe(1);
        // Check label of lightning-input element
        expect(inputFieldEls[0].label).toBe('Search');
    });

    it('renders one contact tile based on user input', () => {
        mockFindContacts.mockResolvedValue = [{ Id: '99', Name: 'Amy Taylor' }];
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
        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise ends in the
        // rejected state
        return Promise.resolve().then(() => {
            // TODO rw: check for method call of findContacts
            // TODO rw: wait for imperative Apex to be called with timer in mind
            const contactTile = element.shadowRoot.querySelector(
                'c-contact-tile'
            );
            expect(contactTile).not.toBeNull();
            expect(contactTile.contact.Name).toBe('Amy Taylor');
        });
    });

    it('renders the error panel', () => {
        mockFindContacts.mockRejectedValue = { message: 'someError' };
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
        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise ends in the
        // rejected state
        return Promise.resolve().then(() => {
            // TODO rw: check for method call of findContacts
            // TODO rw: wait for imperative Apex to be called with timer in mind
            const errorPanel = element.shadowRoot.querySelector(
                'c-error-panel'
            );
            expect(errorPanel).not.toBeNull();
        });
    });
});
