import { createElement } from 'lwc';
import ApiMethod from 'c/apiMethod';

describe('c-api-method', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('calls the public method "refresh" on the c-clock component', async () => {
        // Create component
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

        // Compare if public method has been called
        expect(clockEl.refresh).toHaveBeenCalled();
    });

    it('is accessible', async () => {
        // Create component
        const element = createElement('c-api-method', {
            is: ApiMethod
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
