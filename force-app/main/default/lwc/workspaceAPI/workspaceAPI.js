import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getSingleContact from '@salesforce/apex/ContactController.getSingleContact';

export default class Lds extends NavigationMixin(LightningElement) {
    @wire(getSingleContact) contact;

    navigateToWorkspaceAPIExamples() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Workspace_API'
            }
        });
    }
}
