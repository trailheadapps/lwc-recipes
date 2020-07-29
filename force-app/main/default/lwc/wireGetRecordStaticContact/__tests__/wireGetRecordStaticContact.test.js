import { createElement } from 'lwc';
import WireGetRecordStaticContact from 'c/wireGetRecordStaticContact';
import { getRecord } from 'lightning/uiRecordApi';
import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';

// Mock realistic data
const mockGetRecord = require('./data/getRecord.json');

// Register as an LDS wire adapter. Some tests verify the provisioned values trigger desired behavior.
const getRecordAdapter = registerLdsTestWireAdapter(getRecord);

describe('c-wire-get-record-static-contact', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing.
    function flushPromises() {
        // eslint-disable-next-line no-undef
        return new Promise((resolve) => setImmediate(resolve));
    }

    describe('getRecord @wire data', () => {
        it('renders contact details', () => {
            // Create element
            const element = createElement('c-wire-get-record-dynamic-contact', {
                is: WireGetRecordStaticContact
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getRecordAdapter.emit(mockGetRecord);

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return flushPromises().then(() => {
                // Select elements for validation
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
    });

    describe('getRecord @wire error', () => {
        it('shows error panel element', () => {
            // Create initial element
            const element = createElement('c-wire-get-record-static-contact', {
                is: WireGetRecordStaticContact
            });
            document.body.appendChild(element);

            // Emit error from @wire
            getRecordAdapter.error();

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
});
