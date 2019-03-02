import { createElement } from 'lwc';
import PubsubContactList from 'c/pubsubContactList';
import { fireEvent, registerListener, unregisterAllListeners } from 'c/pubsub';
import {
    registerTestWireAdapter,
    registerApexTestWireAdapter
} from '@salesforce/lwc-jest';
import findContacts from '@salesforce/apex/ContactController.findContacts';
import { CurrentPageReference } from 'lightning/navigation';

// Realistic data with a list of contacts
const mockFindContacts = require('./data/findContacts.json');
// An empty list of records to verify the component does something reasonable
// when there is no data to display
const mockFindContactsNoRecords = require('./data/findContactsNoRecords.json');

// Register as Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const findContactsAdapter = registerApexTestWireAdapter(findContacts);

// Mock out the pubsub lib and use these mocks to verify how functions were called
jest.mock('c/pubsub', () => {
    return {
        fireEvent: jest.fn(),
        registerListener: jest.fn(),
        unregisterAllListeners: jest.fn()
    };
});

// Register as a standard wire adapter because the component under test requires this adapter.
// We don't exercise this wire adapter in the tests.
registerTestWireAdapter(CurrentPageReference);

describe('c-pubsub-contact-list', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('registers and unregisters the pubsub listener during the component lifecycle', () => {
        // Create initial element
        const element = createElement('c-pubsub-contact-list', {
            is: PubsubContactList
        });
        document.body.appendChild(element);

        // Validate if pubsub got registered after connected to the DOM
        expect(registerListener.mock.calls.length).toBe(1);
        expect(registerListener.mock.calls[0][0]).toEqual('searchKeyChange');

        // Validate if pubsub got unregistered after disconnected from the DOM
        document.body.removeChild(element);
        expect(unregisterAllListeners.mock.calls.length).toBe(1);
    });

    describe('findContacts @wire data', () => {
        it('gets called initially with undefined searchkey parameter', () => {
            const WIRE_PARAMETER = { searchKey: undefined };

            // Create initial element
            const element = createElement('c-pubsub-contact-list', {
                is: PubsubContactList
            });
            document.body.appendChild(element);

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                // Validate parameters of wire adapter
                expect(findContactsAdapter.getLastConfig()).toEqual(
                    WIRE_PARAMETER
                );
            });
        });

        it('renders data of one record', () => {
            // Create initial element
            const element = createElement('c-pubsub-contact-list', {
                is: PubsubContactList
            });
            document.body.appendChild(element);

            // Emit data from @wire
            findContactsAdapter.emit(mockFindContacts);

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                // Select elements for validation
                const detailEls = element.shadowRoot.querySelectorAll(
                    'c-contact-list-item-bubbling'
                );
                expect(detailEls.length).toBe(mockFindContacts.length);
            });
        });

        it('renders with no record', () => {
            // Create initial element
            const element = createElement('c-pubsub-contact-list', {
                is: PubsubContactList
            });
            document.body.appendChild(element);

            // Emit data from @wire
            findContactsAdapter.emit(mockFindContactsNoRecords);

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                // Select elements for validation
                const detailEls = element.shadowRoot.querySelectorAll(
                    'c-contact-list-item-bubbling'
                );
                expect(detailEls.length).toBe(mockFindContactsNoRecords.length);
            });
        });
    });

    it('calls fireEvent based on an event from a child c-contact-list-item-bubbling component', () => {
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
        const element = createElement('c-pubsub-contact-list', {
            is: PubsubContactList
        });
        document.body.appendChild(element);

        // Emit data from @wire
        findContactsAdapter.emit(mockFindContacts);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            const detailEl = element.shadowRoot.querySelector(
                'c-contact-list-item-bubbling'
            );
            // Dispatch new event on child component to validate if it triggers
            // a fireEvent call in the current component.
            detailEl.dispatchEvent(
                new CustomEvent('contactselect', {
                    detail: CONTACT,
                    bubbles: true
                })
            );

            expect(fireEvent).toHaveBeenCalledWith(
                undefined,
                'contactSelected',
                CONTACT.Id
            );
        });
    });
});
