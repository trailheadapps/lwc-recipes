import { createElement } from 'lwc';
import HelloBinding from 'c/helloBinding';

describe('c-hello-binding', () => {
    // Reset timer mocks
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    describe('Render UI', () => {
        it('with dynamic greeting', () => {
            // Create initial element
            const element = createElement('c-hello-binding', {
                is: HelloBinding,
            });
            document.body.appendChild(element);
            // Select div for default message check
            let greeting = element.shadowRoot.querySelector('div');
            expect(greeting.textContent).toBe('Hello, World!');
            // Select input field for value change
            const inputField = element.shadowRoot.querySelector(
                'lightning-input',
            );
            inputField.value = 'Test';
            inputField.dispatchEvent(new CustomEvent('change'));
            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise ends in the
            // rejected state
            return Promise.resolve().then(() => {
                // Select div for default message check
                greeting = element.shadowRoot.querySelector('div');
                expect(greeting.textContent).toBe('Hello, Test!');
            });
        });
    });
});
