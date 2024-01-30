import { createElement } from 'lwc';
import ApiSetterGetter from 'c/apiSetterGetter';

describe('c-api-setter-getter', () => {
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
    it('creates a new todo item', async () => {
        const TODO_DESCRIPTION = 'Some ToDo';

        // Create component
        const element = createElement('c-api-setter-getter', {
            is: ApiSetterGetter
        });
        document.body.appendChild(element);

        // Query lightning-input elements
        const lightningInputEls =
            element.shadowRoot.querySelectorAll('lightning-input');

        const todoCountPrevious =
            element.shadowRoot.querySelector('c-todo-list').todos.length;

        // Select input fields for simulating user input
        lightningInputEls.forEach((el) => {
            if (el.label === 'Description') {
                el.value = TODO_DESCRIPTION;
            } else if (el.label === 'Priority') {
                el.checked = true;
            }
            el.dispatchEvent(new CustomEvent('change'));
        });

        // Click button
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Compare if tracked property has been assigned a new value.
        const todoListEl = element.shadowRoot.querySelector('c-todo-list');
        expect(todoListEl.todos.length).toBe(todoCountPrevious + 1);
        expect(todoListEl.todos[2].description).toBe(TODO_DESCRIPTION);
        expect(todoListEl.todos[2].priority).toBe(true);
    });

    it('is accessible', async () => {
        // Create component
        const element = createElement('c-api-setter-getter', {
            is: ApiSetterGetter
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
