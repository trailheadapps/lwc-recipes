import { createElement } from 'lwc';
import ApiFunction from 'c/apiFunction';

describe('c-api-function', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders a lightning-button and a c-clock element', () => {
        // Create initial element
        const element = createElement('c-api-function', {
            is: ApiFunction,
        });
        document.body.appendChild(element);

        // Query lightning-button element
        const lightningButtonEl = element.shadowRoot.querySelector(
            'lightning-button',
        );
        expect(lightningButtonEl).not.toBeNull();
        expect(lightningButtonEl.label).toBe('Refresh Time');

        // Query lightning-button component element
        const clockEl = element.shadowRoot.querySelector('c-clock');
        expect(clockEl).not.toBeNull();
    });

    it('calls the public function "refresh" on the c-clock component', () => {
        // Create initial element
        const element = createElement('c-api-function', {
            is: ApiFunction,
        });
        document.body.appendChild(element);

        // Query lightning-button component element
        const clockEl = element.shadowRoot.querySelector('c-clock');
        clockEl.refresh = jest.fn();

        // Query lightning-button element
        const lightningButtonEl = element.shadowRoot.querySelector(
            'lightning-button',
        );
        lightningButtonEl.dispatchEvent(new CustomEvent('click'));

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise ends in the
        // rejected state
        return Promise.resolve().then(() => {
            // Compare if public function has been called
            expect(clockEl.refresh).toHaveBeenCalled();
        });
    });
});
