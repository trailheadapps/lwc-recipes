import { createElement } from 'lwc';
import MiscDomQuery from 'c/miscDomQuery';

describe('c-misc-dom-query', () => {
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

    it('renders lightning-input checkbox fields unchecked', () => {
        // Create initial element
        const element = createElement('c-misc-dom-query', {
            is: MiscDomQuery
        });
        document.body.appendChild(element);

        // Query all lightning-input fields
        const lightningInputCheckedEls =
            element.shadowRoot.querySelectorAll('lightning-input');
        lightningInputCheckedEls.forEach((input) => {
            expect(input.checked).toBeFalsy();
        });
    });

    it('displays labels of checked lightning-input fields as checked items', async () => {
        // Create initial element
        const element = createElement('c-misc-dom-query', {
            is: MiscDomQuery
        });
        document.body.appendChild(element);

        // Query all lightning-input fields
        const lightningInputEls =
            element.shadowRoot.querySelectorAll('lightning-input');
        lightningInputEls[0].checked = true;
        lightningInputEls[0].dispatchEvent(new CustomEvent('change'));

        // Query p element
        const pEl = element.shadowRoot.querySelector('p');

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check if output text got newly rendered based on checked category lightning-input field
        expect(pEl.textContent).toBe('Checked items: Category 1');

        lightningInputEls[1].checked = true;
        lightningInputEls[1].dispatchEvent(new CustomEvent('change'));

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check if output text got newly rendered based on checked category lightning-input field
        expect(pEl.textContent).toBe('Checked items: Category 1, Category 2');

        lightningInputEls[2].checked = true;
        lightningInputEls[2].dispatchEvent(new CustomEvent('change'));
        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check if output text got newly rendered based on checked category lightning-input field
        expect(pEl.textContent).toBe(
            'Checked items: Category 1, Category 2, Category 3'
        );
    });

    it('is accessible', async () => {
        const element = createElement('c-misc-dom-query', {
            is: MiscDomQuery
        });

        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });
});
