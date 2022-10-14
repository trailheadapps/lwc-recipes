import { createElement } from 'lwc';
import MiscModal from 'c/miscModal';
import LightningModal from 'lightning/modal';

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

    it('shows a modal', async () => {
        const MODAL_PARAMS =
            "{ size: 'small', description: 'MiscModal displays the message in a popup',header: 'The modal header',content: 'The modal content',}";
        // Create initial element
        const element = createElement('c-misc-modal', {
            is: MiscModal
        });
        document.body.appendChild(element);

        LightningModal.open = jest.fn().mockResolvedValue(MODAL_PARAMS);

        // Query modal component element
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check if event has been fired
        expect(LightningModal.open).toHaveBeenCalledTimes(1);
    });

    it('is accessible', async () => {
        const element = createElement('c-misc-modal', {
            is: MiscModal
        });

        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });
});
