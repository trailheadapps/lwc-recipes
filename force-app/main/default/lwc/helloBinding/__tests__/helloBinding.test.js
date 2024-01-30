import { createElement } from 'lwc';
import HelloBinding from 'c/helloBinding';

describe('c-hello-binding', () => {
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

    it('displays greeting specified by change event target', async () => {
        const EXPECTED_NAME = 'Codey';

        // Create component
        const element = createElement('c-hello-binding', {
            is: HelloBinding
        });
        document.body.appendChild(element);

        // Trigger new greeting
        const inputEl = element.shadowRoot.querySelector('lightning-input');
        inputEl.value = EXPECTED_NAME;
        inputEl.dispatchEvent(new CustomEvent('change'));

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Verify displayed greeting
        const div = element.shadowRoot.querySelector('div');
        expect(div.textContent).toBe(`Hello, ${EXPECTED_NAME}!`);
    });

    it('is accessible', async () => {
        const element = createElement('c-hello-binding', {
            is: HelloBinding
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
