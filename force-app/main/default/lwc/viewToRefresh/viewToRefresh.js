import { LightningElement, wire } from 'lwc';
import getTotalNumber from '@salesforce/apex/AccountController.getTotalNumber';
import {
    registerRefreshHandler,
    unregisterRefreshHandler
} from 'lightning/refresh';
import { refreshApex } from '@salesforce/apex';

export default class ViewToRefresh extends LightningElement {
    refreshHandlerID;

    @wire(getTotalNumber)
    numOfAccounts;

    connectedCallback() {
        this.refreshHandlerID = registerRefreshHandler(
            this,
            this.refreshHandler
        );
    }

    disconnectedCallback() {
        unregisterRefreshHandler(this.refreshHandlerID);
    }

    async refreshHandler() {
        await refreshApex(this.numOfAccounts);
    }
}
