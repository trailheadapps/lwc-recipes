import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getSingleC_Solution__c from '@salesforce/apex/ContactController.getSingleC_Solution__c';

export default class NavToRecord extends NavigationMixin(LightningElement) {
    @wire(getSingleC_Solution__c) solution;

    navigateToSolution() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.solution.data.Id,
                objectApiName: 'Solution',
                actionName: 'view'
            }
        });
    }

    navigateToEdit() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.solution.data.Id,
                objectApiName: 'Solution',
                actionName: 'edit'
            }
        });
    }
}
