import { createElement } from 'lwc';
import HelloExpressions from 'c/helloExpressions';

const PREFIX = 'Uppercased Full Name:';

describe('c-hello-expressions', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    function setInputElementValues(element, firstName, lastName) {
        // lightning-input doesn't mirror its properties as attributes so
        // can't use an attribute query selector.
        element.shadowRoot
            .querySelectorAll('lightning-input')
            .forEach(input => {
                if (firstName && input.name === 'firstName') {
                    input.value = firstName;
                    input.dispatchEvent(new CustomEvent('change'));
                } else if (lastName && input.name === 'lastName') {
                    input.value = lastName;
                    input.dispatchEvent(new CustomEvent('change'));
                }
            });
    }

    it('displays first name as uppercase', () => {
        // Create initial element
        const element = createElement('c-hello-expressions', {
            is: HelloExpressions
        });
        document.body.appendChild(element);

        setInputElementValues(element, 'Peter', undefined);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Verify displayed message
            const details = element.shadowRoot.querySelector('p');
            expect(details.textContent).toBe(`${PREFIX} PETER`);
        });
    });

    it('displays last name as uppercase', () => {
        // Create initial element
        const element = createElement('c-hello-expressions', {
            is: HelloExpressions
        });
        document.body.appendChild(element);

        setInputElementValues(element, undefined, 'Pan');

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Verify displayed message
            const details = element.shadowRoot.querySelector('p');
            expect(details.textContent).toBe(`${PREFIX} PAN`);
        });
    });

    it('displays first and last name as uppercase', () => {
        // Create initial element
        const element = createElement('c-hello-expressions', {
            is: HelloExpressions
        });
        document.body.appendChild(element);

        setInputElementValues(element, 'Peter', 'Pan');

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Verify displayed message
            const details = element.shadowRoot.querySelector('p');
            expect(details.textContent).toBe(`${PREFIX} PETER PAN`);
        });
    });
});
