import { createElement } from 'lwc';
import HelloConditionalRendering from 'c/helloConditionalRendering';

describe('c-hello-conditional-rendering', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('does not show details by default', () => {
        // Create element
        const element = createElement('c-hello-conditional-rendering', {
            is: HelloConditionalRendering
        });
        document.body.appendChild(element);

        // Verify displayed message
        const details = element.shadowRoot.querySelector(
            '.slds-m-vertical_medium'
        );
        expect(details.textContent).toBe('Not showing details.');
    });

    it('shows details when checkbox toggled', () => {
        // Create element
        const element = createElement('c-hello-conditional-rendering', {
            is: HelloConditionalRendering
        });
        document.body.appendChild(element);

        // Toggle checkbox to show details
        const input = element.shadowRoot.querySelector('lightning-input');
        input.checked = true;
        input.dispatchEvent(new CustomEvent('change'));

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Verify displayed message
            const details = element.shadowRoot.querySelector(
                '.slds-m-vertical_medium'
            );
            expect(details.textContent).toBe('These are the details!');
        });
    });
});
