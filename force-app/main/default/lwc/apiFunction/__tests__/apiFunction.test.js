import { createElement } from 'lwc';
import ApiFunction from 'c/apiFunction';

describe('c-api-function', () => {
    it('calls the public function "refresh" on the c-clock component', () => {
        // Create initial element
        const element = createElement('c-api-function', {
            is: ApiFunction
        });
        document.body.appendChild(element);

        // Query lightning-button component element
        const clockEl = element.shadowRoot.querySelector('c-clock');
        clockEl.refresh = jest.fn();

        // Query lightning-button element
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Compare if public function has been called
            expect(clockEl.refresh).toHaveBeenCalled();
        });
    });
});
