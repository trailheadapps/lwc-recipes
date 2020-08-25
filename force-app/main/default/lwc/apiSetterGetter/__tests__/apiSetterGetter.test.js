import { createElement } from 'lwc';
import ApiSetterGetter from 'c/apiSetterGetter';

describe('c-api-setter-getter', () => {
    it('creates a new todo item', () => {
        const TODO_DESCRIPTION = 'Some ToDo';

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

        // Select input fields for simulating user input
        lightningInputEls.forEach((el) => {
            if (el.label === 'Description') {
                el.value = TODO_DESCRIPTION;
            } else if (el.label === 'Priority') {
                el.checked = true;
            }
            el.dispatchEvent(new CustomEvent('change'));
        });

        // Select button for simulating click
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Compare if tracked property has been assigned a new value.
            const todoListEl = element.shadowRoot.querySelector('c-todo-list');
            expect(todoListEl.todos.length).toBe(todoCountPrevious + 1);
            expect(todoListEl.todos[2].description).toBe(TODO_DESCRIPTION);
            expect(todoListEl.todos[2].priority).toBe(true);
        });
    });
});
