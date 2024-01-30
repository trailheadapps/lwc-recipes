import { createElement } from 'lwc';
import EventBubbling from 'c/eventBubbling';
import getContactList from '@salesforce/apex/ContactController.getContactList';

// Realistic data with a list of records
const mockGetContactList = require('./data/getContactList.json');

// An empty list of records to verify the component does something reasonable
// when there is no data to display
const mockGetContactListNoRecords = require('./data/getContactListNoRecords.json');

// Mock getContactList Apex wire adapter
jest.mock(
    '@salesforce/apex/ContactController.getContactList',
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

describe('c-event-bubbling', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.
    async function flushPromises() {
        return Promise.resolve();
    }

    describe('getContactList @wire data', () => {
        it('renders two c-contact-list-item-bubbling elements', async () => {
            // Create component
            const element = createElement('c-event-bubbling', {
                is: EventBubbling
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getContactList.emit(mockGetContactList);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Select elements for validation
            const contactListItemEls = element.shadowRoot.querySelectorAll(
                'c-contact-list-item-bubbling'
            );
            expect(contactListItemEls.length).toBe(mockGetContactList.length);
        });

        it('renders no c-contact-list-item-bubbling elements when no data', async () => {
            // Create component
            const element = createElement('c-event-bubbling', {
                is: EventBubbling
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getContactList.emit(mockGetContactListNoRecords);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Select elements for validation
            const contactListItemEls = element.shadowRoot.querySelectorAll(
                'c-contact-list-item-bubbling'
            );
            expect(contactListItemEls.length).toBe(
                mockGetContactListNoRecords.length
            );
        });
    });

    describe('getContactList @wire error', () => {
        it('shows error panel element', async () => {
            // Create component
            const element = createElement('c-event-bubbling', {
                is: EventBubbling
            });
            document.body.appendChild(element);

            // Emit error from @wire
            getContactList.error();

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Check for error panel
            const errorPanelEl =
                element.shadowRoot.querySelector('c-error-panel');
            expect(errorPanelEl).not.toBeNull();
        });
    });

    it('shows selected contact data after bubbled event', async () => {
        const CONTACT = {
            Id: '0031700000pJRRSAA4',
            Name: 'Amy Taylor',
            Title: 'VP of Engineering',
            Phone: '4152568563',
            Email: 'amy@demo.net',
            Picture__c:
                'https://s3-us-west-2.amazonaws.com/dev-or-devrl-s3-bucket/sample-apps/people/amy_taylor.jpg'
        };

        // Create component
        const element = createElement('c-event-bubbling', {
            is: EventBubbling
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getContactList.emit(mockGetContactList);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Select element for validation
        const contactListItemEls = element.shadowRoot.querySelectorAll(
            'c-contact-list-item-bubbling'
        );
        expect(contactListItemEls.length).toBe(mockGetContactList.length);
        // Dispatch event from child element to validate
        // behavior in current component.
        contactListItemEls[0].dispatchEvent(
            new CustomEvent('contactselect', {
                detail: CONTACT,
                bubbles: true
            })
        );

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Select element for validation
        const contactNameEl = element.shadowRoot.querySelector('p');
        expect(contactNameEl.textContent).toBe(CONTACT.Name);
    });

    it('is accessible when data is returned', async () => {
        // Create component
        const element = createElement('c-event-bubbling', {
            is: EventBubbling
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getContactList.emit(mockGetContactList);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });

    it('is accessible when error is returned', async () => {
        // Create component
        const element = createElement('c-event-bubbling', {
            is: EventBubbling
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getContactList.error();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });

    it('is accessible when a contact is selected', async () => {
        const CONTACT = {
            Id: '0031700000pJRRSAA4',
            Name: 'Amy Taylor',
            Title: 'VP of Engineering',
            Phone: '4152568563',
            Email: 'amy@demo.net',
            Picture__c:
                'https://s3-us-west-2.amazonaws.com/dev-or-devrl-s3-bucket/sample-apps/people/amy_taylor.jpg'
        };

        // Create component
        const element = createElement('c-event-bubbling', {
            is: EventBubbling
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getContactList.emit(mockGetContactList);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Select element for validation
        const contactListItemEls = element.shadowRoot.querySelectorAll(
            'c-contact-list-item-bubbling'
        );
        expect(contactListItemEls.length).toBe(mockGetContactList.length);
        // Dispatch event from child element to validate
        // behavior in current component.
        contactListItemEls[0].dispatchEvent(
            new CustomEvent('contactselect', {
                detail: CONTACT,
                bubbles: true
            })
        );

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
