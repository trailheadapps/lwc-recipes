import { createElement } from 'lwc';
import HelloConditionalRendering from 'c/helloConditionalRendering';

describe('c-hello-conditional-rendering', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    describe('Render UI', () => {
        it('with not showing the details', () => {
            // Create initial element
            const element = createElement('c-hello-conditional-rendering', {
                is: HelloConditionalRendering
            });
            document.body.appendChild(element);
            // Select div for default message check
            const details = element.shadowRoot.querySelector(
                '.slds-m-vertical_medium'
            );
            expect(details.textContent).toBe('Not showing details.');
        });
        it('with showing the details', () => {
            // Create initial element
            const element = createElement('c-hello-conditional-rendering', {
                is: HelloConditionalRendering
            });
            document.body.appendChild(element);
            const inputField = element.shadowRoot.querySelector(
                'lightning-input'
            );
            inputField.checked = true;
            inputField.dispatchEvent(new CustomEvent('change'));
            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise ends in the
            // rejected state
            return Promise.resolve().then(() => {
                // Select div for conditionally changed text content
                const details = element.shadowRoot.querySelector(
                    '.slds-m-vertical_medium'
                );
                expect(details.textContent).toBe('These are the details!');
            });
        });
    });
});
