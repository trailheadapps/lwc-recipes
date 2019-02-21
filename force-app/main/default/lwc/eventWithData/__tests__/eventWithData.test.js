import { createElement } from 'lwc';
import EventWithData from 'c/eventWithData';
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
        it('renders two c-contact-list-item elements', () => {
            // Create initial element
            const element = createElement('c-event-with-data', {
                is: EventWithData
            });
            document.body.appendChild(element);
            getContactListAdapter.emit(mockGetContactList);
            return Promise.resolve().then(() => {
                const contactListItemEls = element.shadowRoot.querySelectorAll(
                    'c-contact-list-item'
                );
                expect(contactListItemEls.length).toBe(2);
            });
        });

        it('renders no c-contact-list-item-bubbling elements when no data', () => {
            // Create initial element
            const element = createElement('c-event-event-with-data', {
                is: EventWithData
            });
            document.body.appendChild(element);
            getContactListAdapter.emit(mockGetContactListNoRecords);
            return Promise.resolve().then(() => {
                const contactListItemEls = element.shadowRoot.querySelectorAll(
                    'c-contact-list-item'
                );
                expect(contactListItemEls.length).toBe(0);
            });
        });
    });

    describe('getContactList @wire error', () => {
        it('shows error panel element', () => {
            const element = createElement('c-apex-wire-method-to-function', {
                is: EventWithData
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

    it('shows selected contact data after event', () => {
        const CONTACT_ID = '99';

        const element = createElement('c-event-with-data', {
            is: EventWithData
        });
        document.body.appendChild(element);
        getContactListAdapter.emit(mockGetContactList);
        return Promise.resolve()
            .then(() => {
                const contactListItemEls = element.shadowRoot.querySelectorAll(
                    'c-contact-list-item'
                );
                expect(contactListItemEls.length).toBe(2);
                contactListItemEls[0].dispatchEvent(
                    new CustomEvent('select', {
                        detail: CONTACT_ID
                    })
                );
            })
            .then(() => {
                const contactNameEl = element.shadowRoot.querySelector('p');
                expect(contactNameEl.textContent).toBe('Amy Taylor');
            });
    });
});
