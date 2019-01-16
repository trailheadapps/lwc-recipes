import { LightningElement, api, track } from 'lwc';

export default class TodoList extends LightningElement {
    @track filteredTodos = [];

    _todos = [];

    priorityFilter = false;

    @api
    get todos() {
        return this._todos;
    }
    set todos(value) {
        this._todos = value;
        this.filterTodos();
    }

    filterTodos() {
        if (this.priorityFilter) {
            this.filteredTodos = this._todos.filter(
                todo => todo.priority === true
            );
        } else {
            this.filteredTodos = this._todos;
        }
    }

    handleCheckboxChange(event) {
        this.priorityFilter = event.target.checked;
        this.filterTodos();
    }
}
