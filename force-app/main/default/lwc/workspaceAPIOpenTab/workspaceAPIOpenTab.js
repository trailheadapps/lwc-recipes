import { LightningElement, wire } from 'lwc';
import { IsConsoleNavigation, openTab } from 'lightning/platformWorkspaceApi';

export default class WorkspaceAPIOpenTab extends LightningElement {
    @wire(IsConsoleNavigation) isConsoleNavigation;

    async openTab() {
        if (!this.isConsoleNavigation) {
            return;
        }
        await openTab({
            pageReference: {
                type: 'standard__objectPage',
                attributes: {
                    objectApiName: 'Contact',
                    actionName: 'list'
                }
            },
            focus: true,
            label: 'Contacts List'
        });
    }
}
