import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class NavToHome extends NavigationMixin(LightningElement) {
    navigateToHome() {
        // Use the built-in 'Navigate' method
        this[NavigationMixin.Navigate]({
            // Pass in pageReference
            type: 'standard__namedPage',
            attributes: {
                pageName: 'home'
            }
        });
    }
}
