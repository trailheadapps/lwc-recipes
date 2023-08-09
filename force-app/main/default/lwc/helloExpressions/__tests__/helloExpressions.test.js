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

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.
    async function flushPromises() {
        return Promise.resolve();
    }

    function setInputElementValues(element, firstName, lastName) {
        // lightning-input doesn't mirror its properties as attributes so
        // can't use an attribute query selector.
        element.shadowRoot
            .querySelectorAll('lightning-input')
            .forEach((input) => {
                if (firstName && input.name === 'firstName') {
                    input.value = firstName;
                    input.dispatchEvent(new CustomEvent('change'));
                } else if (lastName && input.name === 'lastName') {
                    input.value = lastName;
                    input.dispatchEvent(new CustomEvent('change'));
                }
            });
    }

    it('displays first name as uppercase', async () => {
        // Create component
        const element = createElement('c-hello-expressions', {
            is: HelloExpressions
        });
        document.body.appendChild(element);

        setInputElementValues(element, 'Peter', undefined);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Verify displayed message
        const detailEl = element.shadowRoot.querySelector('p');
        expect(detailEl.textContent).toBe(`${PREFIX} PETER`);
    });

    it('displays last name as uppercase', async () => {
        // Create component
        const element = createElement('c-hello-expressions', {
            is: HelloExpressions
        });
        document.body.appendChild(element);

        setInputElementValues(element, undefined, 'Pan');

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Verify displayed message
        const detailEl = element.shadowRoot.querySelector('p');
        expect(detailEl.textContent).toBe(`${PREFIX} PAN`);
    });

    it('displays first and last name as uppercase', async () => {
        // Create component
        const element = createElement('c-hello-expressions', {
            is: HelloExpressions
        });
        document.body.appendChild(element);

        setInputElementValues(element, 'Peter', 'Pan');

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Verify displayed message
        const detailEl = element.shadowRoot.querySelector('p');
        expect(detailEl.textContent).toBe(`${PREFIX} PETER PAN`);
    });

    it('is accessible', async () => {
        const element = createElement('c-hello-expressions', {
            is: HelloExpressions
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
