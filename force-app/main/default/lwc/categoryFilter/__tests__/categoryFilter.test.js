import { createElement } from 'lwc';
import CategoryFilter from 'c/categoryFilter';

describe('c-category-filter', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('sends checkbox labels on click as CustomEvent details', () => {
        const element = createElement('c-category-filter', {
            is: CategoryFilter
        });
        document.body.appendChild(element);

        const handler = jest.fn();
        element.addEventListener('filterchange', handler);

        element.shadowRoot
            .querySelectorAll('lightning-input')
            .forEach(checkbox => {
                checkbox.checked = true;
                checkbox.dispatchEvent(new CustomEvent('change'));
            });

        return Promise.resolve().then(() => {
            const inputValues = Array.from(
                element.shadowRoot.querySelectorAll('lightning-input')
            ).map(checkbox => checkbox.label);

            expect(handler.mock.calls.length).toBe(inputValues.length);
            expect(handler.mock.calls[1][0].detail).toEqual({
                filters: inputValues
            });
        });
    });
});
