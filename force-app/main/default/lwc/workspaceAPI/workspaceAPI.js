import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { IsConsoleNavigation } from 'lightning/platformWorkspaceApi';

export default class WorkspaceApi extends NavigationMixin(LightningElement) {
    @wire(IsConsoleNavigation)
    isConsoleNavigation;

    navigateToWorkspaceAPIExamples() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Workspace_API'
            }
        });
    }
}
