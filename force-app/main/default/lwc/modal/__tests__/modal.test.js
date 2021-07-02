import { createElement } from 'lwc';
import Modal from 'c/modal';

describe('c-modal', () => {
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

    it('renders the header content based on a public property and doesn not render the header slot', () => {
        const HEADER = 'The modal header';

        // Create initial element
        const element = createElement('c-modal', {
            is: Modal
        });
        element.header = HEADER;
        element.show();
        document.body.appendChild(element);

        // Query h2 element for header. We use a CSS selector to distinguish
        // between the h2 tag for a header that's set via a public property
        // vs a h2 tag that's set via the slot.
        const headerEl = element.shadowRoot.querySelector(
            'h2[class="slds-text-heading_medium slds-hyphenate header-string"]'
        );

        expect(headerEl.textContent).toBe(HEADER);

        const headerSlotEl = element.shadowRoot.querySelector(
            'slot[name="header"]'
        );
        expect(headerSlotEl).toBeNull();
    });

    // sfdx-lwc-jest cannot validate slotchange events. We're only checking
    // here if the empty h2 div is rendered.
    it('renders the header slot when no public header property is set', async () => {
        // Create initial element
        const element = createElement('c-modal', {
            is: Modal
        });
        element.show();
        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Query header slot element
        const headerSlotEl = element.shadowRoot.querySelector(
            'slot[name="header"]'
        );
        expect(headerSlotEl).not.toBeNull();
    });

    it('hides the modal as default based on a CSS class', () => {
        // Create initial element
        const element = createElement('c-modal', {
            is: Modal
        });
        document.body.appendChild(element);

        const modalContainerElement = element.shadowRoot.querySelector(
            '.slds-modal__container'
        );

        // validate default no DOM rendered
        expect(modalContainerElement).toBeNull();
    });

    it('changes the modal CSS class based on public function calls', async () => {
        // Create initial element
        const element = createElement('c-modal', {
            is: Modal
        });
        document.body.appendChild(element);

        // Call `show` to change showModal to true
        element.show();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Query modal container div element
        const modalContainerElementShow = element.shadowRoot.querySelector(
            '.slds-modal__container'
        );

        // validate we successfully found the modal container DOM element
        expect(modalContainerElementShow.tagName).toBe('DIV');

        // Call 'hide' to set showModal to false
        element.hide();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Query modal container div element
        const modalContainerElementHide = element.shadowRoot.querySelector(
            '.slds-modal__container'
        );

        // validate we successfully removed the modal from the DOM
        expect(modalContainerElementHide).toBeNull();
    });

    it('is accessible when modal shown and public header property is set', async () => {
        const HEADER = 'The modal header';

        // Create initial element
        const element = createElement('c-modal', {
            is: Modal
        });
        element.header = HEADER;
        element.show();
        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });
});
