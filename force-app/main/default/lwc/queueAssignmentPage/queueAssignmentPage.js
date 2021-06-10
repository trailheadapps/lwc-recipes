import { LightningElement, track } from 'lwc';

export default class QueueAssignmentPage extends LightningElement {

    @track users = [];

    userData = [];
    @track selectedUsers = [];

    searchedUsers(event) {
        this.users = [];

        for (let index in event.detail.data) {
            let user = event.detail.data[index];
            // console.log(`${index}: ${this.userData[index].Id}`);
            // console.log(`${index}: ${this.userData[index].Name}`);//Template literals in Javascript
            this.users = [...this.users, { Id: user.Id, Name: user.Name }]
        }

    }
}