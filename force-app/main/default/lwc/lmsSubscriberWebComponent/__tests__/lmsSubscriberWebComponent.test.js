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

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.
    async function flushPromises() {
        return Promise.resolve();
    }

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

    it('invokes getRecord with the published message payload value', async () => {
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

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // The component subscription should cause getRecord to be invoked.
        // Below we test that it is invoked with the messagePayload value
        // that was published with the simulated publish invocation above.
        const { recordId } = getRecordAdapter.getLastConfig();
        expect(recordId).toEqual(messagePayload.recordId);
    });

    describe('getRecord @wire data', () => {
        it('renders contact details with picture', async () => {
            // Create element
            const element = createElement('c-lms-subscriber-web-component', {
                is: LmsSubscriberWebComponent
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getRecordAdapter.emit(mockGetRecord);

            // Wait for any asynchronous DOM updates
            await flushPromises();

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
            expect(phoneEl.value).toBe(mockGetRecord.result.fields.Phone.value);

            const emailEl = element.shadowRoot.querySelector(
                'lightning-formatted-email'
            );
            expect(emailEl.value).toBe(mockGetRecord.result.fields.Email.value);
        });

        it('renders contact details without picture', async () => {
            // Create element
            const element = createElement('c-lms-subscriber-web-component', {
                is: LmsSubscriberWebComponent
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getRecordAdapter.emit(mockGetRecordNoPicture);

            // Wait for any asynchronous DOM updates
            await flushPromises();

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

    describe('getRecord @wire error', () => {
        it('displays a toast message', async () => {
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

            // Wait for any asynchronous DOM updates
            await flushPromises();

            expect(handler).toHaveBeenCalled();
        });
    });

    it('is accessible when contacts returned with picture', async () => {
        // Create element
        const element = createElement('c-lms-subscriber-web-component', {
            is: LmsSubscriberWebComponent
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getRecordAdapter.emit(mockGetRecord);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });

    it('is accessible when contacts returned without picture', async () => {
        // Create element
        const element = createElement('c-lms-subscriber-web-component', {
            is: LmsSubscriberWebComponent
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getRecordAdapter.emit(mockGetRecordNoPicture);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });

    it('is accessible when error returned', async () => {
        // Create element
        const element = createElement('c-lms-subscriber-web-component', {
            is: LmsSubscriberWebComponent
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getRecordAdapter.error();

        // Wait for any asynchronous DOM updates
        await flushPromises();
        await expect(element).toBeAccessible();
    });
});
