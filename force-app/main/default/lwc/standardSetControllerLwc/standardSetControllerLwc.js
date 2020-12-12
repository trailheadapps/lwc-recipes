import { LightningElement, api, track, wire } from 'lwc';
import getAccounts from '@salesforce/apex/lwcStandardSetController.getAccountList';

export default class StandardSetControllerLwc extends LightningElement {
    @track error;
    @track data;
    @track columns;

    connectedCallback() {
        const columns = [
            { label: 'Id', fieldName: 'Id' },
            { label: 'Name', fieldName: 'Name', type: 'text' }
        ];
        this.columns = columns;
        getAccounts({})
            .then(result => {
                this.data = result;
                console.log('test' + result);
            })
            .catch(error => {
                this.error = error;
            })
    }
}