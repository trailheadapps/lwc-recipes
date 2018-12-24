import { createElement } from 'lwc';
import HelloExpressions from 'c/helloExpressions';

describe('c-hello-expressions', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    describe('Render UI', () => {
        it('with default values', () => {
            // Create initial element
            const element = createElement('c-hello-expressions', {
                is: HelloExpressions
            });
            document.body.appendChild(element);
            // Select output for default value check
            const greeting = element.shadowRoot.querySelector('p');
            expect(greeting.textContent).toBe('Uppercased Full Name:  ');
        });
        it('with first name', () => {
            // Create initial element
            const element = createElement('c-hello-expressions', {
                is: HelloExpressions
            });
            document.body.appendChild(element);
            const inputFields = element.shadowRoot.querySelectorAll(
                'lightning-input'
            );
            inputFields.forEach(inputField => {
                // Select input field for first name
                if (inputField.name === 'firstName') {
                    inputField.value = 'Peter';
                    inputField.dispatchEvent(new CustomEvent('change'));
                }
            });
            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise ends in the
            // rejected state
            return Promise.resolve().then(() => {
                // Select output for first name value check
                const fullName = element.shadowRoot.querySelector('p');
                expect(fullName.textContent).toBe(
                    'Uppercased Full Name: PETER '
                );
            });
        });
        it('with last name', () => {
            // Create initial element
            const element = createElement('c-hello-expressions', {
                is: HelloExpressions
            });
            document.body.appendChild(element);
            const inputFields = element.shadowRoot.querySelectorAll(
                'lightning-input'
            );
            inputFields.forEach(inputField => {
                // Select input field for last name
                if (inputField.name === 'lastName') {
                    inputField.value = 'Pan';
                    inputField.dispatchEvent(new CustomEvent('change'));
                }
            });
            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise ends in the
            // rejected state
            return Promise.resolve().then(() => {
                // Select output for default last name value check
                const fullName = element.shadowRoot.querySelector('p');
                expect(fullName.textContent).toBe('Uppercased Full Name:  PAN');
            });
        });
        it('with first and last name', () => {
            // Create initial element
            const element = createElement('c-hello-expressions', {
                is: HelloExpressions
            });
            document.body.appendChild(element);
            const inputFields = element.shadowRoot.querySelectorAll(
                'lightning-input'
            );
            inputFields.forEach(inputField => {
                // Select input field for first name
                if (inputField.name === 'firstName') {
                    inputField.value = 'Peter';
                    inputField.dispatchEvent(new CustomEvent('change'));
                } else if (inputField.name === 'lastName') {
                    // Select input field for last name
                    inputField.value = 'Pan';
                    inputField.dispatchEvent(new CustomEvent('change'));
                }
            });
            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise ends in the
            // rejected state
            return Promise.resolve().then(() => {
                // Select output for first and last name value check
                const fullName = element.shadowRoot.querySelector('p');
                expect(fullName.textContent).toBe(
                    'Uppercased Full Name: PETER PAN'
                );
            });
        });
    });
});
