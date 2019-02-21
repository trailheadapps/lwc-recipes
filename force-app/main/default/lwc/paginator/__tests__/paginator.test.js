import { createElement } from 'lwc';
import Paginator from 'c/paginator';

describe('c-paginator', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('sends "next" and "previous" events on button click', () => {
        const element = createElement('c-paginator', {
            is: Paginator
        });
        document.body.appendChild(element);

        const handlerPrevious = jest.fn();
        const handlerNext = jest.fn();
        element.addEventListener('previous', handlerPrevious);
        element.addEventListener('next', handlerNext);

        element.shadowRoot
            .querySelectorAll('lightning-button')
            .forEach(button => {
                button.click();
            });

        return Promise.resolve().then(() => {
            expect(handlerPrevious.mock.calls.length).toBe(1);
            expect(handlerNext.mock.calls.length).toBe(1);
        });
    });
});
