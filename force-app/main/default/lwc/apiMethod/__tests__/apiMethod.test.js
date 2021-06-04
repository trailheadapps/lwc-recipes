import { createElement } from 'lwc';
import ApiMethod from 'c/apiMethod';

describe('c-api-method', () => {
    it('calls the public method "refresh" on the c-clock component', () => {
        // Create initial element
        const element = createElement('c-api-method', {
            is: ApiMethod
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
            // Compare if public method has been called
            expect(clockEl.refresh).toHaveBeenCalled();
        });
    });

    it('is accessible', () => {
        const element = createElement('c-api-method', {
            is: ApiMethod
        });

        document.body.appendChild(element);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });
});
