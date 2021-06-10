import { api, LightningElement, track } from 'lwc';

export default class UserResutTable extends LightningElement {


    @api users;
    selectedUsers = [];


    get hasUsers() {
        return this.users.length > 0;
    }
    toggleUserSelect(event) {
        // event.preventDefault();
        // console.log(this.users);
        // console.log(event.target.dataset.userId);
        // this.selectedUsers.push(event.target.dataset.userId);

        // this.selectedUsers = [this.selectedUsers, event.target.dataset.userId];
        console.log(event.target.dataset.userId)
        this.selectedUsers.push(event.target.dataset.userId);

    }

    passToQueueAssignment(event) {

        console.log('DDDDDWWWWW ' + this.selectedUsers);

        const searchEvent = new CustomEvent('assignequeues');
        this.dispatchEvent(searchEvent);
    }
}