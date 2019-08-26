import { createElement } from 'lwc';
import ContactList from 'c/contactList';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import getContactList from '@salesforce/apex/ContactController.getContactList';

// Realistic data with a list of contacts
const mockGetContactList = require('./data/getContactList.json');
// An empty list of records to verify the component does something reasonable
// when there is no data to display
const mockGetContactListNoRecords = require('./data/getContactListNoRecords.json');

// Register as Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const getContactListAdapter = registerApexTestWireAdapter(getContactList);

describe('c-contact-list', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    describe('getContactList @wire data', () => {
        it('renders contact data of six records', () => {
            // Create initial element
            const element = createElement('c-contact-list', {
                is: ContactList
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getContactListAdapter.emit(mockGetContactList);

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                // Select elements for validation
                const nameEls = element.shadowRoot.querySelectorAll('p');
                expect(nameEls.length).toBe(mockGetContactList.length);
                expect(nameEls[0].textContent).toBe(mockGetContactList[0].Name);

                const picEl = element.shadowRoot.querySelector('img');
                expect(picEl.src).toBe(mockGetContactList[0].Picture__c);
            });
        });

        it('renders no contact details when no record is present', () => {
            // Create initial element
            const element = createElement('c-contact-list', {
                is: ContactList
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getContactListAdapter.emit(mockGetContactListNoRecords);

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                // Select elements for validation
                const nameEls = element.shadowRoot.querySelectorAll('p');
                expect(nameEls.length).toBe(mockGetContactListNoRecords.length);
            });
        });
    });

    it('sends custom event "contactselect" with contactId on click', () => {
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
        getContactListAdapter.emit(mockGetContactList);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve()
            .then(() => {
                // Select a href to simulate user interaction
                const linkEl = element.shadowRoot.querySelector('a');
                linkEl.click();
            })
            .then(() => {
                // Validate if event got fired
                expect(handler).toHaveBeenCalled();
                expect(handler.mock.calls[0][0].detail).toEqual(
                    EVENT_DETAIL_PARAMETER
                );
            });
    });
});
