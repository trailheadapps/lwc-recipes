import { createElement } from 'lwc';
import WireGetRecordUser from 'c/wireGetRecordUser';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

// Mock realistic data
const mockGetRecord = require('./data/getRecord.json');

describe('c-wire-get-record-user', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing.
    async function flushPromises() {
        return Promise.resolve();
    }

    describe('getRecord @wire data', () => {
        it('renders user record details', async () => {
            // Create element
            const element = createElement('c-wire-get-record-user', {
                is: WireGetRecordUser
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getRecord.emit(mockGetRecord);

            // Wait for any asynchronous DOM updates.
            await flushPromises();

            const userEls = element.shadowRoot.querySelectorAll('p');
            expect(userEls.length).toBe(3);
            expect(getFieldValue.mock.calls.length).toBe(2);
        });
    });

    describe('getRecord @wire error', () => {
        it('shows error panel element', async () => {
            // Create initial element
            const element = createElement('c-wire-get-record-user', {
                is: WireGetRecordUser
            });
            document.body.appendChild(element);

            // Emit error from @wire
            getRecord.error();

            // Wait for any asynchronous DOM updates.
            await flushPromises();

            const errorPanelEl =
                element.shadowRoot.querySelector('c-error-panel');
            await expect(errorPanelEl).not.toBeNull();
        });
    });

    it('is accessible when user is returned', async () => {
        // Create element
        const element = createElement('c-wire-get-record-user', {
            is: WireGetRecordUser
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
        const element = createElement('c-wire-get-record-user', {
            is: WireGetRecordUser
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getRecord.error();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });
});
