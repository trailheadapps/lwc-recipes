import { createElement } from 'lwc';
import LmsSubscriberWebComponent from 'c/lmsSubscriberWebComponent';
import { ShowToastEventName } from 'lightning/platformShowToastEvent';
import { getRecord } from 'lightning/uiRecordApi';
import {
    registerLdsTestWireAdapter,
    registerTestWireAdapter
} from '@salesforce/sfdx-lwc-jest';

import { subscribe, MessageContext, publish } from 'lightning/messageService';
import RECORD_SELECTED_CHANNEL from '@salesforce/messageChannel/Record_Selected__c';

const mockGetRecord = require('./data/getRecord.json');
const mockGetRecordNoPicture = require('./data/getRecordNoPicture.json');

// Register as a LDS wire adapter. Some tests verify the provisioned values trigger desired behavior.
const getRecordAdapter = registerLdsTestWireAdapter(getRecord);

// Register as a standard wire adapter because the component under test requires this adapter.
// We don't exercise this wire adapter in the tests.
const messageContextWireAdapter = registerTestWireAdapter(MessageContext);

describe('c-lms-subscriber-web-component', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('registers the LMS subscriber during the component lifecycle', () => {
        // Create initial element
        const element = createElement('c-lms-subscriber-web-component', {
            is: LmsSubscriberWebComponent
        });
        document.body.appendChild(element);

        // Validate if pubsub got registered after connected to the DOM
        expect(subscribe).toHaveBeenCalled();
        expect(subscribe.mock.calls[0][1]).toBe(RECORD_SELECTED_CHANNEL);
    });

    it('invokes getRecord with the published message payload value', () => {
        // Create element
        const element = createElement('c-lms-subscriber-web-component', {
            is: LmsSubscriberWebComponent
        });
        document.body.appendChild(element);

        // Simulate pulishing a message using RECORD_SELECTED_CHANNEL message channel
        const messagePayload = { recordId: '001' };
        publish(
            messageContextWireAdapter,
            RECORD_SELECTED_CHANNEL,
            messagePayload
        );

        return Promise.resolve().then(() => {
            // The component subscription should cause getRecord to be invoked.
            // Below we test that it is invoked with the messagePayload value
            // that was published with the simulated publish invocation above.
            const { recordId } = getRecordAdapter.getLastConfig();
            expect(recordId).toEqual(messagePayload.recordId);
        });
    });

    describe('getRecord @wire data', () => {
        it('renders contact details with picture', () => {
            // Create element
            const element = createElement('c-lms-subscriber-web-component', {
                is: LmsSubscriberWebComponent
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getRecordAdapter.emit(mockGetRecord);

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                // Select elements for validation
                const imgEl = element.shadowRoot.querySelector('img');
                expect(imgEl.src).toBe(
                    mockGetRecord.result.fields.Picture__c.value
                );

                const nameEl = element.shadowRoot.querySelector('p');
                expect(nameEl.textContent).toBe(
                    mockGetRecord.result.fields.Name.value
                );

                const phoneEl = element.shadowRoot.querySelector(
                    'lightning-formatted-phone'
                );
                expect(phoneEl.value).toBe(
                    mockGetRecord.result.fields.Phone.value
                );

                const emailEl = element.shadowRoot.querySelector(
                    'lightning-formatted-email'
                );
                expect(emailEl.value).toBe(
                    mockGetRecord.result.fields.Email.value
                );
            });
        });

        it('renders contact details without picture', () => {
            // Create element
            const element = createElement('c-lms-subscriber-web-component', {
                is: LmsSubscriberWebComponent
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getRecordAdapter.emit(mockGetRecordNoPicture);

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                // Select elements for validation
                const imgEl = element.shadowRoot.querySelector('img');
                expect(imgEl).toBeNull();

                const nameEl = element.shadowRoot.querySelector('p');
                expect(nameEl.textContent).toBe(
                    mockGetRecordNoPicture.result.fields.Name.value
                );

                const phoneEl = element.shadowRoot.querySelector(
                    'lightning-formatted-phone'
                );
                expect(phoneEl.value).toBe(
                    mockGetRecordNoPicture.result.fields.Phone.value
                );

                const emailEl = element.shadowRoot.querySelector(
                    'lightning-formatted-email'
                );
                expect(emailEl.value).toBe(
                    mockGetRecordNoPicture.result.fields.Email.value
                );
            });
        });
    });

    describe('getRecord @wire error', () => {
        it('displays a toast message', () => {
            // Create initial element
            const element = createElement('c-lms-subscriber-web-component', {
                is: LmsSubscriberWebComponent
            });
            document.body.appendChild(element);

            // Mock handler for toast event
            const handler = jest.fn();
            // Add event listener to catch toast event
            element.addEventListener(ShowToastEventName, handler);

            // Emit error from @wire
            getRecordAdapter.error();

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                expect(handler).toHaveBeenCalled();
            });
        });
    });
});
