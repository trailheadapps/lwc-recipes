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
        // Set initial todo items
        element.todos = TODOS;
        document.body.appendChild(element);

        // Query list items for initial values
        let listItemEls = element.shadowRoot.querySelectorAll('li');
        expect(listItemEls.length).toBe(todosLength);
    });

    it('renders the content of the first todo item', () => {
        // Create initial element
        const element = createElement('c-todo-list', {
            is: TodoList
        });
        element.todos = TODOS;
        document.body.appendChild(element);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise ends in the
        // rejected state
        return Promise.resolve().then(() => {
            // Validate rendered output for first todo object
            let outputEls = element.shadowRoot.querySelectorAll('p');
            expect(outputEls[0].textContent).toBe(TODOS[0].description);
            const msg = `Priority: ${TODOS[0].priority}`;
            expect(outputEls[1].textContent).toBe(msg);
        });
    });
});
