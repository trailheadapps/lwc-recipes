import { createElement } from 'lwc';
import EventWithData from 'c/eventWithData';
import getContactList from '@salesforce/apex/ContactController.getContactList';

// Realistic data with a list of records
const mockGetContactList = require('./data/getContactList.json');

// An empty list of records to verify the component does something reasonable
// when there is no data to display
const mockGetContactListNoRecords = require('./data/getContactListNoRecords.json');

// Mock Apex wire adapter
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

describe('c-event-with-data', () => {
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
        it('renders two c-contact-list-item elements', async () => {
            // Create component
            const element = createElement('c-event-with-data', {
                is: EventWithData
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getContactList.emit(mockGetContactList);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Select elements for validation
            const contactListItemEls = element.shadowRoot.querySelectorAll(
                'c-contact-list-item'
            );
            expect(contactListItemEls.length).toBe(mockGetContactList.length);
        });

        it('renders no c-contact-list-item-bubbling elements when no data', async () => {
            // Create component
            const element = createElement('c-event-with-data', {
                is: EventWithData
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getContactList.emit(mockGetContactListNoRecords);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Select elements for validation
            const contactListItemEls = element.shadowRoot.querySelectorAll(
                'c-contact-list-item'
            );
            expect(contactListItemEls.length).toBe(
                mockGetContactListNoRecords.length
            );
        });
    });

    describe('getContactList @wire error', () => {
        it('shows error panel element', async () => {
            // Create component
            const element = createElement('c-event-with-data', {
                is: EventWithData
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

    it('shows selected contact data after event', async () => {
        // Create component
        const element = createElement('c-event-with-data', {
            is: EventWithData
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getContactList.emit(mockGetContactList);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Select element for validation
        const contactListItemEls = element.shadowRoot.querySelectorAll(
            'c-contact-list-item'
        );
        expect(contactListItemEls.length).toBe(mockGetContactList.length);
        // Dispatch event from child element to validate
        // behavior in current component.
        contactListItemEls[0].dispatchEvent(
            new CustomEvent('select', {
                detail: mockGetContactList[0].Id
            })
        );
        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Select element for validation
        const contactNameEl = element.shadowRoot.querySelector('p');
        expect(contactNameEl.textContent).toBe(mockGetContactList[0].Name);
    });

    it('is accessible when data is returned', async () => {
        // Create component
        const element = createElement('c-event-with-data', {
            is: EventWithData
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
        const element = createElement('c-event-with-data', {
            is: EventWithData
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getContactList.error();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });

    it('is accessible when contact is selected', async () => {
        // Create component
        const element = createElement('c-event-with-data', {
            is: EventWithData
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getContactList.emit(mockGetContactList);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Select element for validation
        const contactListItemEls = element.shadowRoot.querySelectorAll(
            'c-contact-list-item'
        );
        expect(contactListItemEls.length).toBe(mockGetContactList.length);
        // Dispatch event from child element to validate
        // behavior in current component.
        contactListItemEls[0].dispatchEvent(
            new CustomEvent('select', {
                detail: mockGetContactList[0].Id
            })
        );

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
