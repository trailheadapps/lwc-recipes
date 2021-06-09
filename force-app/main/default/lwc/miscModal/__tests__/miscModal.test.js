import { createElement } from 'lwc';
import MiscModal from 'c/miscModal';

describe('c-misc-modal', () => {
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

    it('sets the public properties of the modal component based on default values', async () => {
        const DEFAULT_HEADER = 'The modal header';
        const DEFAULT_CONTENT = 'The modal content';

        // Create initial element
        const element = createElement('c-misc-modal', {
            is: MiscModal
        });
        document.body.appendChild(element);

        // Query modal component element
        const modalEl = element.shadowRoot.querySelector('c-modal');
        modalEl.show();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Compare if public properties on the modal component have been set
        expect(modalEl.header).toBe(DEFAULT_HEADER);
        expect(modalEl.textContent).toBe(DEFAULT_CONTENT);
    });

    it('sets the public properties of the modal component based on user input', async () => {
        const CUSTOM_HEADER = 'A custom header';
        const CUSTOM_CONTENT = 'Some custom content';

        // Create initial element
        const element = createElement('c-misc-modal', {
            is: MiscModal
        });
        document.body.appendChild(element);

        // Query the lightning-input header field
        const lightningInputHeaderEl = element.shadowRoot.querySelector(
            'lightning-input[class="header-jest"]'
        );
        lightningInputHeaderEl.value = CUSTOM_HEADER;
        lightningInputHeaderEl.dispatchEvent(new CustomEvent('change'));

        // Query the lightning-input header field
        const lightningInputContentEl = element.shadowRoot.querySelector(
            'lightning-input[class="content-jest"]'
        );
        lightningInputContentEl.value = CUSTOM_CONTENT;
        lightningInputContentEl.dispatchEvent(new CustomEvent('change'));

        // Query modal component element
        const modalEl = element.shadowRoot.querySelector('c-modal');
        modalEl.show();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Compare if public properties on the modal component have been set
        expect(modalEl.header).toBe(CUSTOM_HEADER);
        expect(modalEl.textContent).toBe(CUSTOM_CONTENT);
    });

    it('calls the public function "show" on the c-modal component', async () => {
        // Create initial element
        const element = createElement('c-misc-modal', {
            is: MiscModal
        });
        document.body.appendChild(element);

        // Query modal component element
        const modalEl = element.shadowRoot.querySelector('c-modal');
        modalEl.show = jest.fn();

        // Query lightning-button element
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Compare if public function has been called
        expect(modalEl.show).toHaveBeenCalled();
    });

    it('is accessible', async () => {
        const element = createElement('c-misc-modal', {
            is: MiscModal
        });

        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });
});
