import { createElement } from 'lwc';
import WireGetRecordStaticContact from 'c/wireGetRecordStaticContact';
import { getRecord } from 'lightning/uiRecordApi';
import { registerLdsTestWireAdapter } from '@salesforce/lwc-jest';

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

    describe('getRecord @wire data', () => {
        it('renders contact details', () => {
            // Create element
            const element = createElement('c-wire-get-record-dynamic-contact', {
                is: WireGetRecordStaticContact
            });
            document.body.appendChild(element);

            getRecordAdapter.emit(mockGetRecord);

            return Promise.resolve(() => {
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
    });

    describe('getRecord @wire error', () => {
        it('shows error panel element', () => {
            const element = createElement('c-wire-get-record-dynamic-contact', {
                is: WireGetRecordStaticContact
            });
            document.body.appendChild(element);
            getRecordAdapter.error();
            return Promise.resolve().then(() => {
                const errorPanelEl = element.shadowRoot.querySelector(
                    'c-error-panel'
                );
                expect(errorPanelEl).not.toBeNull();
            });
        });
    });
});
