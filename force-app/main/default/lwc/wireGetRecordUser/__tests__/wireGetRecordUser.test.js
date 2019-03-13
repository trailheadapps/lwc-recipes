import { createElement } from 'lwc';
import WireGetRecordUser from 'c/wireGetRecordUser';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { registerLdsTestWireAdapter } from '@salesforce/lwc-jest';

// Mock realistic data
const mockGetRecord = require('./data/getRecord.json');

// Register as an LDS wire adapter. Some tests verify the provisioned values trigger desired behavior.
const getRecordAdapter = registerLdsTestWireAdapter(getRecord);

describe('c-wire-get-record-user', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    describe('getRecord @wire data', () => {
        it('renders user record details', () => {
            // Create element
            const element = createElement('c-wire-get-record-user', {
                is: WireGetRecordUser
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getRecordAdapter.emit(mockGetRecord);

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                const userEls = element.shadowRoot.querySelectorAll('p');
                expect(userEls.length).toBe(3);

                // getFieldValue is a default jest.fn() mock. We're not testing
                // the functionality, but if it gets called accordingly.
                expect(getFieldValue.mock.calls.length).toBe(2);
            });
        });
    });

    describe('getRecord @wire error', () => {
        it('shows error panel element', () => {
            // Create initial element
            const element = createElement('c-wire-get-record-user', {
                is: WireGetRecordUser
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
