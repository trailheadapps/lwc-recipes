import { LightningElement, track } from 'lwc';

export default class QueueAssignmentPage extends LightningElement {

    @track users = [];

    userData = [];

    searchedUsers(event) {

        for (let user in event.detail.data) {
            // console.log(`${user}: ${this.userData[user].Id}`);
            // console.log(`${user}: ${this.userData[user].Name}`);//Template literals in Javascript
            console.log(this.userData[user].Name);
        }

    }
}