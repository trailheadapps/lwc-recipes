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
        // Create initial element
        const element = createElement('c-category-filter', {
            is: CategoryFilter
        });
        document.body.appendChild(element);

        // Mock handler for child event
        const handler = jest.fn();
        // Add event listener to catch child event
        element.addEventListener('filterchange', handler);

        // Select input fields for simulating user input
        element.shadowRoot
            .querySelectorAll('lightning-input')
            .forEach((checkbox) => {
                checkbox.checked = true;
                checkbox.dispatchEvent(new CustomEvent('change'));
            });

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            const inputValues = Array.from(
                element.shadowRoot.querySelectorAll('lightning-input')
            ).map((checkbox) => checkbox.label);

            // Validate filterchange event
            expect(handler.mock.calls.length).toBe(inputValues.length);
            expect(handler.mock.calls[1][0].detail).toEqual({
                filters: inputValues
            });
        });
    });
});
