import { createElement } from 'lwc';
import WireCurrentPageReference from 'c/wireCurrentPageReference';
import { CurrentPageReference } from 'lightning/navigation';

// Mock realistic data
const mockCurrentPageReference = require('./data/CurrentPageReference.json');

describe('c-wire-current-page-reference', () => {
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

    it('renders the current page reference as <pre> tag', async () => {
        // Create element
        const element = createElement('c-wire-current-page-reference', {
            is: WireCurrentPageReference
        });
        document.body.appendChild(element);

        // Select element for validation
        const preEl = element.shadowRoot.querySelector('pre');
        expect(preEl).not.toBeNull();

        // Emit data from @wire
        CurrentPageReference.emit(mockCurrentPageReference);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        expect(preEl.textContent).toBe(
            JSON.stringify(mockCurrentPageReference, null, 2)
        );
    });

    it('is accessible', async () => {
        const element = createElement('c-wire-current-page-reference', {
            is: WireCurrentPageReference
        });

        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });
});
