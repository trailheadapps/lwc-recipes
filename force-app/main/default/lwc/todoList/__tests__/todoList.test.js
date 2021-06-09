import { createElement } from 'lwc';
import TodoList from 'c/todoList';

let TODOS = [
    { id: 1, description: 'Explore recipes', priority: false },
    { id: 2, description: 'Install Ebikes sample app', priority: false }
];

describe('c-todo-list', () => {
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

    it('renders without any list items as default', () => {
        // Create initial element
        const element = createElement('c-todo-list', {
            is: TodoList
        });
        document.body.appendChild(element);

        // Query for rendered list items
        const listItemEls = element.shadowRoot.querySelectorAll('li');
        expect(listItemEls.length).toBe(0);
    });

    it('renders multiple list items', () => {
        const todosLength = TODOS.length;

        // Create initial element
        const element = createElement('c-todo-list', {
            is: TodoList
        });
        // Set public properties
        element.todos = TODOS;
        document.body.appendChild(element);

        // Query list items for initial values
        let listItemEls = element.shadowRoot.querySelectorAll('li');
        expect(listItemEls.length).toBe(todosLength);
    });

    it('renders the content of the first todo item', async () => {
        // Create initial element
        const element = createElement('c-todo-list', {
            is: TodoList
        });
        // Set public properties
        element.todos = TODOS;
        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Validate rendered output for first todo object
        let outputEls = element.shadowRoot.querySelectorAll('p');
        expect(outputEls[0].textContent).toBe(TODOS[0].description);
        const msg = `Priority: ${TODOS[0].priority}`;
        expect(outputEls[1].textContent).toBe(msg);
    });

    it('is accessible when todo items added', async () => {
        // Create initial element
        const element = createElement('c-todo-list', {
            is: TodoList
        });
        // Set public properties
        element.todos = TODOS;
        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });
});
