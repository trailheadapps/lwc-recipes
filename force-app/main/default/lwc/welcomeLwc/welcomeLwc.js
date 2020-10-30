import { LightningElement } from 'lwc';

export default class WelcomeLwc extends LightningElement {

    name;

    changeTheName(event) {

        this.name = event.target.value;
    }
}