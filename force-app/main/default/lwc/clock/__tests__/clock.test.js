import { createElement } from 'lwc';
import Clock from 'c/clock';

describe('c-clock', () => {
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

    it('sets current date/time after public function call', async () => {
        // Create initial element
        const element = createElement('c-clock', {
            is: Clock
        });
        document.body.appendChild(element);

        // Query lightning-formatted-date-time element
        const lightningDateTimeEl = element.shadowRoot.querySelector(
            'lightning-formatted-date-time'
        );
        const currentDateTimeVal = lightningDateTimeEl.value;

        // Call public function on element
        element.refresh();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Compare if tracked property has been assigned a new value.
        expect(lightningDateTimeEl.value).not.toBe(currentDateTimeVal);
    });

    it('is accessible', async () => {
        const element = createElement('c-clock', {
            is: Clock
        });

        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });
});
