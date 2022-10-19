import { createElement } from 'lwc';
import HelloConditionalRendering from 'c/helloConditionalRendering';

describe('c-hello-conditional-rendering', () => {
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

    it('does not show details by default', () => {
        // Create element
        const element = createElement('c-hello-conditional-rendering', {
            is: HelloConditionalRendering
        });
        document.body.appendChild(element);

        // Verify displayed message
        const detailEl = element.shadowRoot.querySelector(
            '.slds-var-m-vertical_medium'
        );
        expect(detailEl.textContent).toBe('Not showing details.');
    });

    it('shows details when checkbox toggled', async () => {
        // Create element
        const element = createElement('c-hello-conditional-rendering', {
            is: HelloConditionalRendering
        });
        document.body.appendChild(element);

        // Toggle checkbox to show details
        const inputEl = element.shadowRoot.querySelector('lightning-input');
        inputEl.checked = true;
        inputEl.dispatchEvent(new CustomEvent('change'));

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Verify displayed message
        const detailEl = element.shadowRoot.querySelector(
            '.slds-var-m-vertical_medium'
        );
        expect(detailEl.textContent).toBe('These are the details!');
    });

    it('is accessible when details are visible', async () => {
        const element = createElement('c-hello-conditional-rendering', {
            is: HelloConditionalRendering
        });

        document.body.appendChild(element);

        // Toggle checkbox to show details
        const inputEl = element.shadowRoot.querySelector('lightning-input');
        inputEl.checked = true;
        inputEl.dispatchEvent(new CustomEvent('change'));

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });

    it('is accessible when details are not visible', async () => {
        const element = createElement('c-hello-conditional-rendering', {
            is: HelloConditionalRendering
        });

        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });
});
