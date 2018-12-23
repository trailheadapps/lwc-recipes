import { createElement } from 'lwc';
import Hello from 'c/hello';

describe('c-hello', () => {
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
        it('with greeting', () => {
            // Create initial element
            const element = createElement('c-hello', {
                is: Hello,
            });
            document.body.appendChild(element);
            // Select div for default message check
            const greeting = element.shadowRoot.querySelector('div');
            expect(greeting.textContent).toBe('Hello, World!');
        });
    });
});
