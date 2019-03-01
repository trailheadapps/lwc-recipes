import { createElement } from 'lwc';
import ApexStaticSchema from 'c/apexStaticSchema';
import { registerApexTestWireAdapter } from '@salesforce/lwc-jest';
import getSingleContact from '@salesforce/apex/ContactController.getSingleContact';

// Realistic data with a single record
const mockGetSingleContact = require('./data/getSingleContact.json');
// An empty list of records to verify the component does something reasonable
// when there is no data to display
const mockGetSingleContactNoRecord = require('./data/getSingleContactNoRecord.json');

// Register as an Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const getSingleContactAdapter = registerApexTestWireAdapter(getSingleContact);

describe('c-apex-static-schema', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    describe('getSingleContact @wire data', () => {
        it('with single record', () => {
            const USER_RESULT = 'Amy Taylor';
            const TITLE_RESULT = 'VP of Engineering';
            const EMAIL_RESULT = 'amy@demo.net';

            const element = createElement('c-apex-static-schema', {
                is: ApexStaticSchema
            });
            document.body.appendChild(element);
            getSingleContactAdapter.emit(mockGetSingleContact);

            // Return a promise to wait for any asynchronous DOM updates.
            return Promise.resolve().then(() => {
                const detailEls = element.shadowRoot.querySelectorAll('p');
                expect(detailEls[0].textContent).toBe(USER_RESULT);
                expect(detailEls[1].textContent).toBe(TITLE_RESULT);

                const emailEl = element.shadowRoot.querySelector(
                    'lightning-formatted-email'
                );
                expect(emailEl.value).toBe(EMAIL_RESULT);
            });
        });

        it('with no record', () => {
            const element = createElement('c-apex-static-schema', {
                is: ApexStaticSchema
            });
            document.body.appendChild(element);
            getSingleContactAdapter.emit(mockGetSingleContactNoRecord);

            // Return a promise to wait for any asynchronous DOM updates.
            return Promise.resolve().then(() => {
                const detailEls = element.shadowRoot.querySelectorAll('p');
                expect(detailEls[0].textContent).toBe('');
                expect(detailEls[1].textContent).toBe('');

                const emailEl = element.shadowRoot.querySelector(
                    'lightning-formatted-email'
                );
                expect(emailEl.value).toBeUndefined();
            });
        });
    });

    describe('getSingleContact @wire error', () => {
        it('shows error panel element', () => {
            const element = createElement('c-apex-static-schema', {
                is: ApexStaticSchema
            });
            document.body.appendChild(element);
            getSingleContactAdapter.error();
            return Promise.resolve().then(() => {
                const errorPanelEl = element.shadowRoot.querySelector(
                    'c-error-panel'
                );
                expect(errorPanelEl).not.toBeNull();
            });
        });
    });
});
