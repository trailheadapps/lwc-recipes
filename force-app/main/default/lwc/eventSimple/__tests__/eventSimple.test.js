import { createElement } from 'lwc';
import EventSimple from 'c/eventSimple';

describe('c-event-simple', () => {
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

    it('increments and decrements the page value by 1 on button click', async () => {
        // Create initial element
        const element = createElement('c-event-simple', {
            is: EventSimple
        });
        document.body.appendChild(element);

        const paginatorEl = element.shadowRoot.querySelector('c-paginator');
        const buttonEls =
            paginatorEl.shadowRoot.querySelectorAll('lightning-button');

        // First click "Next", so that the page property increments to 2
        buttonEls.forEach((buttonEl) => {
            if (buttonEl.label === 'Next') {
                buttonEl.click();
            }
        });

        const pageEl = element.shadowRoot.querySelector('p');

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Verify that property is correctly incremented.
        expect(pageEl.textContent).toBe('Page 2');

        // Now click "Previous", so that the page property decrements to 1
        buttonEls.forEach((buttonEl) => {
            if (buttonEl.label === 'Previous') {
                buttonEl.click();
            }
        });

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Verify that property is correctly incremented.
        expect(pageEl.textContent).toBe('Page 1');

        // Decrement again
        buttonEls.forEach((buttonEl) => {
            if (buttonEl.label === 'Previous') {
                buttonEl.click();
            }
        });

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Verify that property is not decremented, and the initial value stays on 1.
        expect(pageEl.textContent).toBe('Page 1');
    });

    it('is accessible', async () => {
        const element = createElement('c-event-simple', {
            is: EventSimple
        });

        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });
});
