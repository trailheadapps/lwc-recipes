import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getSingleAccount from '@salesforce/apex/AccountController.getSingleAccount';

export default class NavToRelatedList extends NavigationMixin(
    LightningElement
) {
    @wire(getSingleAccount) account;

    navigateToRelatedList() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordRelationshipPage',
            attributes: {
                recordId: this.account.data.Id,
                objectApiName: 'Account',
                relationshipApiName: 'Contacts',
                actionName: 'view'
            }
        });
    }
}
