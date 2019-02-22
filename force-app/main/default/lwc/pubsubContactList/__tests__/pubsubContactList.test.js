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

// Register as an Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
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
        const element = createElement('c-pubsub-contact-list', {
            is: PubsubContactList
        });
        document.body.appendChild(element);

        expect(registerListener.mock.calls.length).toBe(1);
        expect(registerListener.mock.calls[0][0]).toEqual('searchKeyChange');

        document.body.removeChild(element);
        expect(unregisterAllListeners.mock.calls.length).toBe(1);
    });

    describe('findContacts @wire data', () => {
        it('gets called initially with undefined searchkey parameter', () => {
            const WIRE_PARAMETER = { searchKey: undefined };

            const element = createElement('c-pubsub-contact-list', {
                is: PubsubContactList
            });
            document.body.appendChild(element);

            return Promise.resolve().then(() => {
                expect(findContactsAdapter.getLastConfig()).toEqual(
                    WIRE_PARAMETER
                );
            });
        });

        it('renders data of one record', () => {
            const element = createElement('c-pubsub-contact-list', {
                is: PubsubContactList
            });
            document.body.appendChild(element);

            findContactsAdapter.emit(mockFindContacts);
            return Promise.resolve().then(() => {
                const detailEls = element.shadowRoot.querySelectorAll(
                    'c-contact-list-item-bubbling'
                );
                expect(detailEls.length).toBe(1);
            });
        });

        it('renders with no record', () => {
            const element = createElement('c-pubsub-contact-list', {
                is: PubsubContactList
            });
            document.body.appendChild(element);

            findContactsAdapter.emit(mockFindContactsNoRecords);
            return Promise.resolve().then(() => {
                const detailEls = element.shadowRoot.querySelectorAll(
                    'c-contact-list-item-bubbling'
                );
                expect(detailEls.length).toBe(0);
            });
        });
    });

    it('calls fireEvent based on an event from a child c-contact-list-item-bubbling component', () => {
        const CONTACT = { Id: '99', Name: 'Amy Taylor' };

        const element = createElement('c-pubsub-contact-list', {
            is: PubsubContactList
        });
        document.body.appendChild(element);

        findContactsAdapter.emit(mockFindContacts);
        return Promise.resolve().then(() => {
            const detailEl = element.shadowRoot.querySelector(
                'c-contact-list-item-bubbling'
            );
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
