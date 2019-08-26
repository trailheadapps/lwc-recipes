import { createElement } from 'lwc';
import EventBubbling from 'c/eventBubbling';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import getContactList from '@salesforce/apex/ContactController.getContactList';

// Realistic data with a list of records
const mockGetContactList = require('./data/getContactList.json');

// An empty list of records to verify the component does something reasonable
// when there is no data to display
const mockGetContactListNoRecords = require('./data/getContactListNoRecords.json');

// Register as Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
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

            // Emit data from @wire
            getContactListAdapter.emit(mockGetContactList);

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                // Select elements for validation
                const contactListItemEls = element.shadowRoot.querySelectorAll(
                    'c-contact-list-item-bubbling'
                );
                expect(contactListItemEls.length).toBe(
                    mockGetContactList.length
                );
            });
        });

        it('renders no c-contact-list-item-bubbling elements when no data', () => {
            // Create initial element
            const element = createElement('c-event-bubbling', {
                is: EventBubbling
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getContactListAdapter.emit(mockGetContactListNoRecords);

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                // Select elements for validation
                const contactListItemEls = element.shadowRoot.querySelectorAll(
                    'c-contact-list-item-bubbling'
                );
                expect(contactListItemEls.length).toBe(
                    mockGetContactListNoRecords.length
                );
            });
        });
    });

    describe('getContactList @wire error', () => {
        it('shows error panel element', () => {
            // Create initial element
            const element = createElement('c-event-bubbling', {
                is: EventBubbling
            });
            document.body.appendChild(element);

            // Emit error from @wire
            getContactListAdapter.error();

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

    it('shows selected contact data after bubbled event', () => {
        const CONTACT = {
            Id: '0031700000pJRRSAA4',
            Name: 'Amy Taylor',
            Title: 'VP of Engineering',
            Phone: '4152568563',
            Email: 'amy@demo.net',
            Picture__c:
                'https://s3-us-west-1.amazonaws.com/sfdc-demo/people/amy_taylor.jpg'
        };

        // Create initial element
        const element = createElement('c-event-bubbling', {
            is: EventBubbling
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getContactListAdapter.emit(mockGetContactList);

        return Promise.resolve()
            .then(() => {
                // Select element for validation
                const contactListItemEls = element.shadowRoot.querySelectorAll(
                    'c-contact-list-item-bubbling'
                );
                expect(contactListItemEls.length).toBe(
                    mockGetContactList.length
                );
                // Dispatch event from child element to validate
                // behavior in current component.
                contactListItemEls[0].dispatchEvent(
                    new CustomEvent('contactselect', {
                        detail: CONTACT,
                        bubbles: true
                    })
                );
            })
            .then(() => {
                // Select element for validation
                const contactNameEl = element.shadowRoot.querySelector('p');
                expect(contactNameEl.textContent).toBe(CONTACT.Name);
            });
    });
});
