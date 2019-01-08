import { createElement } from 'lwc';
import ApiSetterGetter from 'c/apiSetterGetter';

describe('c-api-setter-getter', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders two lightning-input components, one lightning-button component, and one c-todo-list component', () => {
        const expectedLabels = ['Description', 'Priority'];
        // Create initial element
        const element = createElement('c-api-setter-getter', {
            is: ApiSetterGetter
        });
        document.body.appendChild(element);
        // Check for two existing lightning-input elements, and validate labels
        const lightningInputLabels = Array.from(
            element.shadowRoot.querySelectorAll('lightning-input')
        ).map(el => el.label);
        expect(expectedLabels).toEqual(lightningInputLabels);
        // Check lightning-button and label
        const lightningButtonEl = element.shadowRoot.querySelector(
            'lightning-button'
        );
        expect(lightningButtonEl).not.toBeNull();
        expect(lightningButtonEl.label).toBe('Add Todo');
        // Check todo-list component
        const todoListEl = element.shadowRoot.querySelector('c-todo-list');
        expect(todoListEl).not.toBeNull();
    });

    it('creates a new todo item', () => {
        // Create initial element
        const element = createElement('c-api-setter-getter', {
            is: ApiSetterGetter
        });
        document.body.appendChild(element);

        // Query lightning-input elements
        const lightningInputEls = element.shadowRoot.querySelectorAll(
            'lightning-input[label="Description"]'
        );

        lightningInputEls.forEach(el => {
            if (el.label === 'Description') {
                el.value = 'Some ToDo';
            } else if (el.label === 'Priority') {
                el.checked = true;
            }
            el.dispatchEvent(new CustomEvent('change'));
        });

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise ends in the
        // rejected state
        return Promise.resolve().then(() => {
            // Compare if tracked property has been assigned a new value.
            const todoListEl = element.shadowRoot.querySelector('c-todo-list');
            expect(todoListEl.todos.length).toBe(3);
            expect(todoListEl.todos[2].id).toBe(3);
            expect(todoListEl.todos[2].description).toBe('some ToDo');
            expect(todoListEl.todos[2].priority).toBeTruthy();
        });
    });
});
