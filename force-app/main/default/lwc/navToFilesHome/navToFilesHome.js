import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class NavToFilesHome extends NavigationMixin(LightningElement) {
    navigateToFilesHome() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'ContentDocument',
                actionName: 'home'
            }
        });
    }
}
