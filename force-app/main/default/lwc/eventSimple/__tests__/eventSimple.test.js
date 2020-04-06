import { createElement } from 'lwc';
import EventSimple from 'c/eventSimple';

describe('c-event-simple', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('increments and decrements the page value by 1 on button click', () => {
        // Create initial element
        const element = createElement('c-event-simple', {
            is: EventSimple
        });
        document.body.appendChild(element);

        const paginatorEl = element.shadowRoot.querySelector('c-paginator');
        const buttonEls = paginatorEl.shadowRoot.querySelectorAll(
            'lightning-button'
        );

        // First click "Next", so that the page property increments to 2
        buttonEls.forEach((buttonEl) => {
            if (buttonEl.label === 'Next') {
                buttonEl.click();
            }
        });

        const pageEl = element.shadowRoot.querySelector('p');

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve()
            .then(() => {
                // Verify that property is correctly incremented.
                expect(pageEl.textContent).toBe('Page 2');

                // Now click "Previous", so that the page property decrements to 1
                buttonEls.forEach((buttonEl) => {
                    if (buttonEl.label === 'Previous') {
                        buttonEl.click();
                    }
                });
            })
            .then(() => {
                // Verify that property is correctly incremented.
                expect(pageEl.textContent).toBe('Page 1');

                // Decrement again
                buttonEls.forEach((buttonEl) => {
                    if (buttonEl.label === 'Previous') {
                        buttonEl.click();
                    }
                });
            })
            .then(() => {
                // Verify that property is not decremented, and the initial value stays on 1.
                expect(pageEl.textContent).toBe('Page 1');
            });
    });
});
