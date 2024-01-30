import { createElement } from 'lwc';
import MiscMultipleTemplates from 'c/miscMultipleTemplates';

// Same template resources imported into module for testing
import trailheadLogo from '@salesforce/resourceUrl/trailhead_logo';
import trailheadCharacters from '@salesforce/resourceUrl/trailhead_characters';

// Text constants to test text content
const TEMPLATE1_TEXT_CONTENT = 'Template One';
const TEMPLATE2_TEXT_CONTENT = 'Template Two';
const TEMPLATE1_LOGO_URL = trailheadLogo;
const TEMPLATE2_LOGO_URL = `${trailheadCharacters}/images/einstein.png`;

describe('c-misc-multiple-templates', () => {
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

    it('displays templateOne on initial render', () => {
        // Create component
        const element = createElement('c-misc-multiple-templates', {
            is: MiscMultipleTemplates
        });
        document.body.appendChild(element);

        // On initial render templateOne should be displayed
        // Retrieve and verify text element from DOM
        const pEl = element.shadowRoot.querySelector('p');
        expect(pEl.textContent).toBe(TEMPLATE1_TEXT_CONTENT);

        // Retrieve and verify image element from DOM
        const imgEl = element.shadowRoot.querySelector('img');
        expect(imgEl.getAttribute('src')).toBe(TEMPLATE1_LOGO_URL);
    });

    it('displays templateTwo on click', async () => {
        // Create component
        const element = createElement('c-misc-multiple-templates', {
            is: MiscMultipleTemplates
        });
        document.body.appendChild(element);

        // Simulate user click
        const button = element.shadowRoot.querySelector('lightning-button');
        button.click();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Once click invoked, templateTwo should be in place.

        // Retrieve and verify text element from DOM
        const pEl = element.shadowRoot.querySelector('p');
        expect(pEl.textContent).toBe(TEMPLATE2_TEXT_CONTENT);

        // Retrieve and verify image element from DOM
        const imgEl = element.shadowRoot.querySelector('img');
        expect(imgEl.getAttribute('src')).toBe(TEMPLATE2_LOGO_URL);
    });

    it('displays templateOne after two clicks', async () => {
        // Create component
        const element = createElement('c-misc-multiple-templates', {
            is: MiscMultipleTemplates
        });
        document.body.appendChild(element);

        // Simulate two user clicks
        const button = element.shadowRoot.querySelector('lightning-button');
        button.click();
        button.click();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Once two clicks invoked, templateOne should be in place.

        // Retrieve and verify text element from DOM
        const pEl = element.shadowRoot.querySelector('p');
        expect(pEl.textContent).toBe(TEMPLATE1_TEXT_CONTENT);

        // Retrieve and verify image element from DOM
        const imgEl = element.shadowRoot.querySelector('img');
        expect(imgEl.getAttribute('src')).toBe(TEMPLATE1_LOGO_URL);
    });

    it('is accessible when template1 is shown', async () => {
        const element = createElement('c-misc-multiple-templates', {
            is: MiscMultipleTemplates
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });

    it('is accessible when template2 is shown', async () => {
        const element = createElement('c-misc-multiple-templates', {
            is: MiscMultipleTemplates
        });
        document.body.appendChild(element);

        // Simulate user click
        const button = element.shadowRoot.querySelector('lightning-button');
        button.click();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
