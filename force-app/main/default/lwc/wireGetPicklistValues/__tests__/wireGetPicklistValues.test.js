import { createElement } from 'lwc';
import WireGetPicklistValues from 'c/wireGetPicklistValues';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

// Mock realistic data
const mockGetPicklistValues = require('./data/getPicklistValues.json');

describe('c-wire-get-picklist-values', () => {
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

    describe('getPicklistValues @wire data', () => {
        it('renders seven lightning-input fields of type checkbox', () => {
            // Create element
            const element = createElement('c-wire-get-picklist-values', {
                is: WireGetPicklistValues
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getPicklistValues.emit(mockGetPicklistValues);

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                // Select elements for validation
                const checkboxEls =
                    element.shadowRoot.querySelectorAll('lightning-input');
                expect(checkboxEls.length).toBe(
                    mockGetPicklistValues.values.length
                );

                checkboxEls.forEach((checkboxEl) => {
                    expect(checkboxEl.type).toBe('checkbox');
                });
            });
        });
    });

    describe('getObjectInfo @wire error', () => {
        it('shows error panel element', async () => {
            // Create initial element
            const element = createElement('c-wire-get-picklist-values', {
                is: WireGetPicklistValues
            });
            document.body.appendChild(element);

            // Emit error from @wire
            getPicklistValues.error();

            // Wait for any asynchronous DOM updates
            await flushPromises();

            const errorPanelEl =
                element.shadowRoot.querySelector('c-error-panel');
            expect(errorPanelEl).not.toBeNull();
        });
    });

    it('is accessible when picklist values are returned', async () => {
        // Create element
        const element = createElement('c-wire-get-picklist-values', {
            is: WireGetPicklistValues
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getPicklistValues.emit(mockGetPicklistValues);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });

    it('is accessible when error is returned', async () => {
        // Create element
        const element = createElement('c-wire-get-picklist-values', {
            is: WireGetPicklistValues
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getPicklistValues.error();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });
});
