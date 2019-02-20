import { createElement } from 'lwc';
import EventBubbling from 'c/eventBubbling';
import { registerApexTestWireAdapter } from '@salesforce/lwc-jest';
import getContactList from '@salesforce/apex/ContactController.getContactList';

// Realistic data with a list of records
const mockGetContactList = require('./data/getContactList.json');
// An empty list of records to verify the component does something reasonable
// when there is no data to display
const mockGetContactListNoRecords = require('./data/getContactListNoRecords.json');

// Register as an Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const getContactListAdapter = registerApexTestWireAdapter(getContactList);

describe('c-event-bubbling', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    describe('getContactList @wire data', () => {
        it('renders two c-contact-list-item-bubbling elements', () => {
            // Create initial element
            const element = createElement('c-event-bubbling', {
                is: EventBubbling
            });
            document.body.appendChild(element);
            getContactListAdapter.emit(mockGetContactList);
            return Promise.resolve().then(() => {
                const contactListItemEls = element.shadowRoot.querySelectorAll(
                    'c-contact-list-item-bubbling'
                );
                expect(contactListItemEls.length).toBe(2);
            });
        });

        it('renders no c-contact-list-item-bubbling elements when no data', () => {
            // Create initial element
            const element = createElement('c-event-bubbling', {
                is: EventBubbling
            });
            document.body.appendChild(element);
            getContactListAdapter.emit(mockGetContactListNoRecords);
            return Promise.resolve().then(() => {
                const contactListItemEls = element.shadowRoot.querySelectorAll(
                    'c-contact-list-item-bubbling'
                );
                expect(contactListItemEls.length).toBe(0);
            });
        });
    });

    describe('getContactList @wire error', () => {
        it('shows error panel element', () => {
            const element = createElement('c-apex-wire-method-to-function', {
                is: EventBubbling
            });
            document.body.appendChild(element);
            getContactListAdapter.error();
            return Promise.resolve().then(() => {
                const errorPanelEl = element.shadowRoot.querySelector(
                    'c-error-panel'
                );
                expect(errorPanelEl).not.toBeNull();
            });
        });
    });

    it('shows selected contact data after bubbled event', () => {
        const CONTACT = { Id: '99', Name: 'Amy Taylor' };

        const element = createElement('c-apex-wire-method-to-function', {
            is: EventBubbling
        });
        document.body.appendChild(element);
        getContactListAdapter.emit(mockGetContactList);
        return Promise.resolve()
            .then(() => {
                const contactListItemEls = element.shadowRoot.querySelectorAll(
                    'c-contact-list-item-bubbling'
                );
                expect(contactListItemEls.length).toBe(2);
                contactListItemEls[0].dispatchEvent(
                    new CustomEvent('contactselect', {
                        detail: CONTACT,
                        bubbles: true
                    })
                );
            })
            .then(() => {
                const contactNameEl = element.shadowRoot.querySelector('p');
                expect(contactNameEl.textContent).toBe('Amy Taylor');
            });
    });
});
