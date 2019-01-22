import { createElement } from 'lwc';
import ApiSetterGetter from 'c/apiSetterGetter';

describe('c-api-setter-getter', () => {
    it('creates a new todo item', () => {
        const todoDescription = 'Some ToDo';

        // Create initial element
        const element = createElement('c-api-setter-getter', {
            is: ApiSetterGetter
        });
        document.body.appendChild(element);

        // Query lightning-input elements
        const lightningInputEls = element.shadowRoot.querySelectorAll(
            'lightning-input'
        );

        const todoCountPrevious = element.shadowRoot.querySelector(
            'c-todo-list'
        ).todos.length;

        lightningInputEls.forEach(el => {
            if (el.label === 'Description') {
                el.value = todoDescription;
            } else if (el.label === 'Priority') {
                el.checked = true;
            }
            el.dispatchEvent(new CustomEvent('change'));
        });

        const lightningButtonEl = element.shadowRoot.querySelector(
            'lightning-button'
        );
        lightningButtonEl.dispatchEvent(new CustomEvent('click'));

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise ends in the
        // rejected state
        return Promise.resolve().then(() => {
            // Compare if tracked property has been assigned a new value.
            const todoListEl = element.shadowRoot.querySelector('c-todo-list');
            expect(todoListEl.todos.length).toBe(todoCountPrevious + 1);
            expect(todoListEl.todos[2].description).toBe(todoDescription);
            expect(todoListEl.todos[2].priority).toBe(true);
        });
    });
});
