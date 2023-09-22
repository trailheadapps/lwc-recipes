import { createElement } from 'lwc';
import ApiSpread from 'c/apiSpread';

describe('c-api-spread', () => {
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

    // Helper function to set values in the lightning-input elements
    function setInputElementValues(element, firstName, lastName) {
        // lightning-input doesn't mirror its properties as attributes so
        // can't use an attribute query selector.
        element.shadowRoot
            .querySelectorAll('lightning-input')
            .forEach((input) => {
                if (firstName && input.name === 'firstName') {
                    input.value = firstName;
                    input.dispatchEvent(new CustomEvent('change'));
                } else if (lastName && input.name === 'lastName') {
                    input.value = lastName;
                    input.dispatchEvent(new CustomEvent('change'));
                }
            });
    }

    it('renders c-child component with default values', () => {
        // Create component
        const element = createElement('c-api-spread', {
            is: ApiSpread
        });
        document.body.appendChild(element);

        // Query child component
        const childEl = element.shadowRoot.querySelector('c-child');
        expect(childEl).not.toBeNull();

        // Validation for default values passed down to child component
        expect(childEl.firstName).toBe('Amy');
        expect(childEl.lastName).toBe('Taylor');
    });

    it('changes the value of the c-child component based on user input', async () => {
        // Create component
        const element = createElement('c-api-spread', {
            is: ApiSpread
        });
        document.body.appendChild(element);

        // Set values in the lightning-input elements
        setInputElementValues(element, 'Jennifer', 'Wu');

        // Query child component
        const childEl = element.shadowRoot.querySelector('c-child');
        expect(childEl).not.toBeNull();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Validation for values of lwc spread properties passed down to child component
        expect(childEl.firstName).toBe('Jennifer');
        expect(childEl.lastName).toBe('Wu');
    });

    it('is accessible', async () => {
        // Create component
        const element = createElement('c-api-spread', {
            is: ApiSpread
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
