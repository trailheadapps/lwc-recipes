import { api, LightningElement, track } from 'lwc';

export default class UserResutTable extends LightningElement {


    @api users;
    @track selectedUsers = [];


    toggleUserSelect(event) {
        console.log(this.users);
        console.log(event.target.dataset.userId);


    }

    passToQueueAssignment(event) {


    }
}