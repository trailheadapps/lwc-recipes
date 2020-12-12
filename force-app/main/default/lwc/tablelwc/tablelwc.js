import { LightningElement, track } from 'lwc';
import getFirstRecords from '@salesforce/apex/contactRecord.getContactList';

export default class Tablelwc extends LightningElement {
    @track searchTerm = '';
    @track bears;
    @track ranger;
    @track left;
    @track top;


    showData(event) {
        this.ranger = event.currentTarget.dataset.id;
        console.log(event.currentTarget.dataset.id); 
        console.log(event.clientX); console.log(event.clientY);

        this.left = event.clientX;
        this.top = event.clientY;

    }
    hideData(event) {
        this.ranger = "";
    }
    get assignClass() {
        return this.active ? '' : 'slds-hint-parent';
    }
    constructor() {
        super();
        getFirstRecords({
        })
            .then(result => {
                if (result) {
                    console.log(result)
                    this.bears = result;
                }
            })
            .catch(error => {
                error = error;
            });

    }

}