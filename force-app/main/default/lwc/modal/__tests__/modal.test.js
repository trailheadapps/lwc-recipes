import { createElement } from 'lwc';
import Modal from 'c/modal';

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
    it('renders the header slot when no public header property is set', () => {
        // Create initial element
        const element = createElement('c-modal', {
            is: Modal
        });
        element.show();
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

        const modalContainerElement = element.shadowRoot.querySelector(
            '.slds-modal__container'
        );

        // validate default no DOM rendered
        expect(modalContainerElement).toBeNull();
    });

    it('changes the modal CSS class based on public function calls', () => {
        // Create initial element
        const element = createElement('c-modal', {
            is: Modal
        });
        document.body.appendChild(element);

        // Call `show` to change showModal to true
        element.show();

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve()
            .then(() => {
                // Query modal container div element
                const modalContainerElementShow = element.shadowRoot.querySelector(
                    '.slds-modal__container'
                );

                // validate we successfully found the modal container DOM element
                expect(modalContainerElementShow.tagName).toBe('DIV');

                // Call 'hide' to set showModal to false
                element.hide();
            })
            .then(() => {
                // Query modal container div element
                const modalContainerElementHide = element.shadowRoot.querySelector(
                    '.slds-modal__container'
                );

                // validate we successfully removed the modal from the DOM
                expect(modalContainerElementHide).toBeNull();
            });
    });
});
