import { createElement } from 'lwc';
import Paginator from 'c/paginator';

describe('c-paginator', () => {
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

    it('sends "next" and "previous" events on button click', async () => {
        // Create component
        const element = createElement('c-paginator', {
            is: Paginator
        });
        document.body.appendChild(element);

        // Mock handlers for child events
        const handlerPrevious = jest.fn();
        const handlerNext = jest.fn();
        // Add event listener to catch child events
        element.addEventListener('previous', handlerPrevious);
        element.addEventListener('next', handlerNext);

        element.shadowRoot
            .querySelectorAll('lightning-button')
            .forEach((button) => {
                button.click();
            });

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Validate if mocked events got fired
        expect(handlerPrevious.mock.calls.length).toBe(1);
        expect(handlerNext.mock.calls.length).toBe(1);
    });

    it('is accessible', async () => {
        const element = createElement('c-paginator', {
            is: Paginator
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
