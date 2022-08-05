import { createElement } from 'lwc';
import WireGetRecords from 'c/wireGetRecords';
import { getRecords } from 'lightning/uiRecordApi';

// Mock realistic data
const mockGetRecords = require('./data/wireGetRecordsResponse.json');

describe('c-wire-get-records', () => {
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

    describe('getRecords @wire data', () => {
        it('renders the records value in the pre tag', async () => {
            // Create element
            const element = createElement('c-wire-get-records', {
                is: WireGetRecords
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getRecords.emit(mockGetRecords);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Select element for validation
            const preEl = element.shadowRoot.querySelector('pre');
            expect(preEl.textContent).toEqual(
                JSON.stringify(mockGetRecords, null, 2)
            );
        });
    });

    describe('getRecords @wire error', () => {
        it('shows error panel element', async () => {
            // Create initial element
            const element = createElement('c-wire-get-records', {
                is: WireGetRecords
            });
            document.body.appendChild(element);

            // Emit error from @wire
            getRecords.error();

            // Wait for any asynchronous DOM updates
            await flushPromises();

            const errorPanelEl =
                element.shadowRoot.querySelector('c-error-panel');
            expect(errorPanelEl).not.toBeNull();
        });
    });

    it('is accessible when records returned', async () => {
        // Create element
        const element = createElement('c-wire-get-records', {
            is: WireGetRecords
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getRecords.emit(mockGetRecords);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });

    it('is accessible when error returned', async () => {
        // Create element
        const element = createElement('c-wire-get-records', {
            is: WireGetRecords
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getRecords.error();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });
});
