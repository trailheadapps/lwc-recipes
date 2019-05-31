import { createElement } from 'lwc';
import Modal from 'c/modal';

const CSS_CLASS = 'modal-hidden';

describe('c-modal', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders the header content based on a public property and doesn not render the header slot', () => {
        const HEADER = 'The modal header';

        // Create initial element
        const element = createElement('c-modal', {
            is: Modal
        });
        element.header = HEADER;
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

    // lwc-jest cannot validate slotchange events. We're only checking
    // here if the empty h2 div is rendered.
    it('renders the header slot when no public header property is set', () => {
        // Create initial element
        const element = createElement('c-modal', {
            is: Modal
        });
        document.body.appendChild(element);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Query header slot element
            const headerSlotEl = element.shadowRoot.querySelector(
                'slot[name="header"]'
            );
            expect(headerSlotEl).not.toBeNull();
        });
    });

    it('hides the modal as default based on a CSS class', () => {
        // Create initial element
        const element = createElement('c-modal', {
            is: Modal
        });
        document.body.appendChild(element);

        const outerDivEl = element.shadowRoot.querySelector('div');

        // // Validate default value
        expect(outerDivEl.classList.value).toBe(CSS_CLASS);
    });

    it('changes the modal CSS class based on public function calls', () => {
        // Create initial element
        const element = createElement('c-modal', {
            is: Modal
        });
        document.body.appendChild(element);

        const outerDivEl = element.shadowRoot.querySelector('div');

        // Call `show` function to remove CSS class
        element.show();

        // // Validate that CSS class is removed
        expect(outerDivEl.classList.value).toBe('');

        // Call `hide` function to add CSS class
        element.hide();

        // // Validate that CSS class is added
        expect(outerDivEl.classList.value).toBe(CSS_CLASS);
    });
});
