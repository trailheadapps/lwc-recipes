import { createElement } from '@lwc/engine-dom';
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
        it('renders seven lightning-input fields of type checkbox', async () => {
            // Create component
            const element = createElement('c-wire-get-picklist-values', {
                is: WireGetPicklistValues
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getPicklistValues.emit(mockGetPicklistValues);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Ensures that inputs are checkboxes
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

    describe('getObjectInfo @wire error', () => {
        it('shows error panel element', async () => {
            // Create component
            const element = createElement('c-wire-get-picklist-values', {
                is: WireGetPicklistValues
            });
            document.body.appendChild(element);

            // Emit error from @wire
            getPicklistValues.error();

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Check for error panel
            const errorPanelEl =
                element.shadowRoot.querySelector('c-error-panel');
            expect(errorPanelEl).not.toBeNull();
        });
    });

    it('is accessible when picklist values are returned', async () => {
        // Create component
        const element = createElement('c-wire-get-picklist-values', {
            is: WireGetPicklistValues
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getPicklistValues.emit(mockGetPicklistValues);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });

    it('is accessible when error is returned', async () => {
        // Create component
        const element = createElement('c-wire-get-picklist-values', {
            is: WireGetPicklistValues
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getPicklistValues.error();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
