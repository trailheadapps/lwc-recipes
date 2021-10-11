import { createElement } from 'lwc';
import WireGetRecordDynamicContact from 'c/wireGetRecordDynamicContact';
import { getRecord } from 'lightning/uiRecordApi';

// Mock realistic data
const mockGetRecord = require('./data/getRecord.json');

describe('c-wire-get-record-dynamic-contact', () => {
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

    describe('getRecord @wire data', () => {
        it('renders contact details', async () => {
            // Create element
            const element = createElement('c-wire-get-record-dynamic-contact', {
                is: WireGetRecordDynamicContact
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getRecord.emit(mockGetRecord);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Select elements for validation
            const nameEl = element.shadowRoot.querySelector('p');
            expect(nameEl.textContent).toBe(mockGetRecord.fields.Name.value);

            const phoneEl = element.shadowRoot.querySelector(
                'lightning-formatted-phone'
            );
            expect(phoneEl.value).toBe(mockGetRecord.fields.Phone.value);

            const emailEl = element.shadowRoot.querySelector(
                'lightning-formatted-email'
            );
            expect(emailEl.value).toBe(mockGetRecord.fields.Email.value);
        });
    });

    describe('getRecord @wire error', () => {
        it('shows error panel element', async () => {
            // Create initial element
            const element = createElement('c-wire-get-record-dynamic-contact', {
                is: WireGetRecordDynamicContact
            });
            document.body.appendChild(element);

            // Emit error from @wire
            getRecord.error();

            // Wait for any asynchronous DOM updates
            await flushPromises();

            const errorPanelEl =
                element.shadowRoot.querySelector('c-error-panel');
            expect(errorPanelEl).not.toBeNull();
        });
    });

    it('is accessible when data is returned', async () => {
        // Create element
        const element = createElement('c-wire-get-record-dynamic-contact', {
            is: WireGetRecordDynamicContact
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getRecord.emit(mockGetRecord);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });

    it('is accessible when error is returned', async () => {
        // Create element
        const element = createElement('c-wire-get-record-dynamic-contact', {
            is: WireGetRecordDynamicContact
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getRecord.error();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });
});
