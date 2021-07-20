import { createElement } from 'lwc';
import ContactList from 'c/contactList';
import getContactList from '@salesforce/apex/ContactController.getContactList';

// Realistic data with a list of contacts
const mockGetContactList = require('./data/getContactList.json');

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

describe('c-contact-list', () => {
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

    describe('getContactList @wire', () => {
        it('renders contact data of six records when data returned', async () => {
            // Create initial element
            const element = createElement('c-contact-list', {
                is: ContactList
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getContactList.emit(mockGetContactList);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Select elements for validation
            const nameEls = element.shadowRoot.querySelectorAll('p');
            expect(nameEls.length).toBe(mockGetContactList.length);
            expect(nameEls[0].textContent).toBe(mockGetContactList[0].Name);

            const picEl = element.shadowRoot.querySelector('img');
            expect(picEl.src).toBe(mockGetContactList[0].Picture__c);
        });
    });

    it('sends custom event "contactselect" with contactId on click', async () => {
        const EVENT_DETAIL_PARAMETER = { contactId: '0031700000pJRRSAA4' };

        // Create initial element
        const element = createElement('c-contact-list', {
            is: ContactList
        });
        document.body.appendChild(element);

        // Mock handler for child event
        const handler = jest.fn();
        // Add event listener to catch child event
        element.addEventListener('contactselect', handler);

        // Emit data from @wire
        getContactList.emit(mockGetContactList);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Select a href to simulate user interaction
        const linkEl = element.shadowRoot.querySelector('a');
        linkEl.click();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Validate if event got fired
        expect(handler).toHaveBeenCalled();
        expect(handler.mock.calls[0][0].detail).toEqual(EVENT_DETAIL_PARAMETER);
    });

    it('is accessible when data is returned', async () => {
        // Create initial element
        const element = createElement('c-contact-list', {
            is: ContactList
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getContactList.emit(mockGetContactList);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });
});
