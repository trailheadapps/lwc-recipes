import { LightningElement, track, api } from 'lwc';
import getContactList from '@salesforce/apex/contactRecord.getContactList';

export default class Lwcfilter extends LightningElement {
    @track ContactList = [];
    constructor () {
        super();
        getContactList({

        })
            .then(result => {
                if (result) {
                    console.log('test',result);
                    this.ContactList = result;
                }
            })
            .catch(error => {
                this.error = error;
            });
    }
    displayPopup(event) {
        let targetId = event.target.dataset.id;
        console.log(targetId);
        console.log(document.getElementById(targetId));


    }
    hidePopup(event) {
        var targetId = event.target.dataset.id;
       
    }
}