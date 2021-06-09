import { createElement } from 'lwc';
import ApiMethod from 'c/apiMethod';

describe('c-api-method', () => {
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

    it('calls the public method "refresh" on the c-clock component', async () => {
        // Create initial element
        const element = createElement('c-api-method', {
            is: ApiMethod
        });
        document.body.appendChild(element);

        // Query lightning-button component element
        const clockEl = element.shadowRoot.querySelector('c-clock');
        clockEl.refresh = jest.fn();

        // Query lightning-button element
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Compare if public method has been called
        expect(clockEl.refresh).toHaveBeenCalled();
    });

    it('is accessible', async () => {
        const element = createElement('c-api-method', {
            is: ApiMethod
        });

        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });
});
