import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class NavToHelloTab extends NavigationMixin(LightningElement) {
    navigateToHelloTab() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Hello'
            }
        });
    }
}
