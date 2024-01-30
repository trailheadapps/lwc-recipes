import { createElement } from 'lwc';
import Child from 'c/child';

describe('c-child', () => {
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

    it('renders c-child component with the welcome message', async () => {
        // Create component
        const element = createElement('c-child', {
            is: Child
        });

        // Set public properties
        element.firstName = 'Amy';
        element.lastName = 'Taylor';
        document.body.appendChild(element);

        // Query p for validating default welcome message
        const pEl = element.shadowRoot.querySelector('p');

        // Validation for default welcome message with initial values in public properties
        expect(pEl.textContent).toBe('Hello, Amy Taylor!');

        // Set new values in public properties
        element.firstName = 'Jennifer';
        element.lastName = 'Wu';

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Validation for welcome message with new values in public properties
        expect(pEl.textContent).toBe('Hello, Jennifer Wu!');
    });

    it('is accessible', async () => {
        // Create component
        const element = createElement('c-child', {
            is: Child
        });
        element.firstName = 'Amy';
        element.lastName = 'Taylor';
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
