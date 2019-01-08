import { createElement } from 'lwc';
import TodoList from 'c/todoList';

const todos = [
    { id: 1, description: 'Explore recipes', priority: true },
    { id: 2, description: 'Install Ebikes sample app', priority: false }
];

describe('c-todo-list', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders one lightning-input element and no list items as default', () => {
        // Create initial element
        const element = createElement('c-todo-list', {
            is: TodoList
        });
        document.body.appendChild(element);

        // Query for lightning-input elemenst
        const lightningInputEl = element.shadowRoot.querySelector(
            'lightning-input'
        );
        expect(lightningInputEl).not.toBeNull();
        expect(lightningInputEl.label).toBe('Priority Only');
        expect(lightningInputEl.checked).toBeFalsy();

        // Query for rendered list items
        const listItemEls = element.shadowRoot.querySelectorAll('li');
        expect(listItemEls.length).toBe(0);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise ends in the
        // rejected state
        return Promise.resolve().then(() => {
            // Compare if tracked property has been assigned a new value.
        });
    });

    it('renders multiple list items and filters based on priority', () => {
        // Create initial element
        const element = createElement('c-todo-list', {
            is: TodoList
        });
        element.todos = todos;
        document.body.appendChild(element);

        // Query list items for initial values
        let listItemEls = element.shadowRoot.querySelectorAll('li');
        expect(listItemEls.length).toBe(2);

        todos.push({
            id: 3,
            description: 'Test todo list',
            priority: false
        });

        element.todos = todos;

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise ends in the
        // rejected state
        return Promise.resolve()
            .then(() => {
                // Check if rendered list got updated with three items
                listItemEls = element.shadowRoot.querySelectorAll('li');
                expect(listItemEls.length).toBe(3);

                const lightningInputEl = element.shadowRoot.querySelector(
                    'lightning-input'
                );
                lightningInputEl.checked = true;
                lightningInputEl.dispatchEvent(new CustomEvent('change'));
            })
            .then(() => {
                // Check if rendered list got filtered based on priority flag
                listItemEls = element.shadowRoot.querySelectorAll('li');
                expect(listItemEls.length).toBe(1);
            });
    });

    it('renders and filters list items', () => {
        // Create initial element
        const element = createElement('c-todo-list', {
            is: TodoList
        });
        element.todos = todos;
        document.body.appendChild(element);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise ends in the
        // rejected state
        return Promise.resolve().then(() => {
            // Validate rendered output for first todo object
            let outputEls = element.shadowRoot.querySelector('p');
            expect(outputEls[0].textContent).toBe(todos[0].description);
            const regex = new RegExp(`Priority: ${todos[0].priority}`);
            expect(outputEls[1].textContent).toBe(regex);
        });
    });
});
