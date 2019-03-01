import { createElement } from 'lwc';
import PubsubContactDetails from 'c/pubsubContactDetails';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { getRecord } from 'lightning/uiRecordApi';
import {
    registerLdsTestWireAdapter,
    registerTestWireAdapter
} from '@salesforce/lwc-jest';
import { CurrentPageReference } from 'lightning/navigation';

const mockGetRecord = require('./data/getRecord.json');
const mockGetRecordNoPicture = require('./data/getRecordNoPicture.json');

// Register as a LDS wire adapter. Some tests verify the provisioned values trigger desired behavior.
const getRecordAdapter = registerLdsTestWireAdapter(getRecord);

// Mock out the event firing function to verify it was called with expected parameters.
jest.mock('c/pubsub', () => {
    return {
        registerListener: jest.fn(),
        unregisterAllListeners: jest.fn()
    };
});

// Register as a standard wire adapter because the component under test requires this adapter.
// We don't exercise this wire adapter in the tests.
registerTestWireAdapter(CurrentPageReference);

describe('c-pubsub-contact-details', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('registers and unregisters the pubsub listener during the component lifecycle', () => {
        const element = createElement('c-pubsub-contact-details', {
            is: PubsubContactDetails
        });
        document.body.appendChild(element);

        expect(registerListener.mock.calls.length).toBe(1);
        expect(registerListener.mock.calls[0][0]).toBe('contactSelected');

        document.body.removeChild(element);
        expect(unregisterAllListeners.mock.calls.length).toBe(1);
    });

    describe('getRecord @wire data', () => {
        it('renders contact details with picture', () => {
            // Create element
            const element = createElement('c-pubsub-contact-details', {
                is: PubsubContactDetails
            });
            document.body.appendChild(element);

            getRecordAdapter.emit(mockGetRecord);

            return Promise.resolve(() => {
                const imgEl = element.shadowRoot.querySelector('img');
                expect(imgEl.src).toBe(mockGetRecord.result.fields.Picture__c);

                const nameEl = element.shadowRoot.querySelector('p');
                expect(nameEl.textContent).toBe(
                    mockGetRecord.result.fields.Name
                );

                const phoneEl = element.shadowRoot.querySelector(
                    'lightning-formatted-phone'
                );
                expect(phoneEl.value).toBe(mockGetRecord.result.fields.Phone);

                const emailEl = element.shadowRoot.querySelector(
                    'lightning-formatted-email'
                );
                expect(emailEl.value).toBe(mockGetRecord.result.fields.Email);
            });
        });

        it('renders contact details without picture', () => {
            // Create element
            const element = createElement('c-pubsub-contact-details', {
                is: PubsubContactDetails
            });
            document.body.appendChild(element);

            getRecordAdapter.emit(mockGetRecordNoPicture);

            return Promise.resolve(() => {
                const imgEl = element.shadowRoot.querySelector('img');
                expect(imgEl.src).toBeNull();

                const nameEl = element.shadowRoot.querySelector('p');
                expect(nameEl.textContent).toBe(
                    mockGetRecordNoPicture.result.fields.Name
                );

                const phoneEl = element.shadowRoot.querySelector(
                    'lightning-formatted-phone'
                );
                expect(phoneEl.value).toBe(
                    mockGetRecordNoPicture.result.fields.Phone
                );

                const emailEl = element.shadowRoot.querySelector(
                    'lightning-formatted-email'
                );
                expect(emailEl.value).toBe(
                    mockGetRecordNoPicture.result.fields.Email
                );
            });
        });
    });

    describe('getRecord @wire error', () => {
        it('displays a toast message', () => {
            const element = createElement('c-pubsub-contact-details', {
                is: PubsubContactDetails
            });
            document.body.appendChild(element);

            const handler = jest.fn();
            element.addEventListener('lightning__showtoast', handler);
            getRecordAdapter.error();
            return Promise.resolve().then(() => {
                expect(handler.mock.calls.length).toBe(1);
            });
        });
    });
});
