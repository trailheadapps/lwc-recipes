import { createElement } from 'lwc';
import WireGetRecord from 'c/wireGetRecord';
import { getRecord } from 'lightning/uiRecordApi';

// Mock realistic data
const mockGetRecord = require('./data/wireGetRecordResponse.json');

describe('c-wire-get-record', () => {
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
        it('renders the record value in the pre tag', async () => {
            // Create component
            const element = createElement('c-wire-get-record', {
                is: WireGetRecord
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getRecord.emit(mockGetRecord);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Select element for validation
            const preEl = element.shadowRoot.querySelector('pre');
            expect(preEl.textContent).toEqual(
                JSON.stringify(mockGetRecord, null, 2)
            );
        });
    });

    describe('getRecord @wire error', () => {
        it('shows error panel element', async () => {
            // Create component
            const element = createElement('c-wire-get-record', {
                is: WireGetRecord
            });
            document.body.appendChild(element);

            // Emit error from @wire
            getRecord.error();

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Check for error panel
            const errorPanelEl =
                element.shadowRoot.querySelector('c-error-panel');
            expect(errorPanelEl).not.toBeNull();
        });
    });

    it('is accessible when record returned', async () => {
        // Create component
        const element = createElement('c-wire-get-record', {
            is: WireGetRecord
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getRecord.emit(mockGetRecord);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });

    it('is accessible when error returned', async () => {
        // Create component
        const element = createElement('c-wire-get-record', {
            is: WireGetRecord
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getRecord.error();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
