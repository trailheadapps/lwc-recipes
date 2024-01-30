import { createElement } from 'lwc';
import DispatchRefreshEvent from 'c/dispatchRefreshEvent';
import { RefreshEventName } from 'lightning/refresh';

describe('c-dispatch-refresh-event', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling createRecord.
    async function flushPromises() {
        return Promise.resolve();
    }

    it('should dispatch refresh event on success', async () => {
        // Create component
        const element = createElement('c-dispatch-refresh-event', {
            is: DispatchRefreshEvent
        });
        document.body.appendChild(element);

        // Mock handler for RefreshEvent
        const refreshHandler = jest.fn();
        // Add event listener to catch refresh event
        element.addEventListener(RefreshEventName, refreshHandler);

        const lightningEditFormEl = element.shadowRoot.querySelector(
            'lightning-record-edit-form'
        );
        lightningEditFormEl.dispatchEvent(
            new CustomEvent('success', { detail: { fields: {} } })
        );

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Validate RefreshEvent is fired
        expect(refreshHandler).toHaveBeenCalledTimes(1);
    });

    it('is accessible', async () => {
        const element = createElement('c-dispatch-refresh-event', {
            is: DispatchRefreshEvent
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
