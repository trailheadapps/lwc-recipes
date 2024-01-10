import { LightningElement, wire } from 'lwc';
import {
    IsConsoleNavigation,
    EnclosingTabId,
    openSubtab
} from 'lightning/platformWorkspaceApi';

export default class WorkspaceAPIOpenSubtab extends LightningElement {
    @wire(IsConsoleNavigation) isConsoleNavigation;
    @wire(EnclosingTabId) enclosingTabId;

    findEnclosingTabAndOpenSubtab() {
        if (!this.isConsoleNavigation || !this.enclosingTabId) {
            return;
        }
        openSubtab(this.enclosingTabId, {
            pageReference: {
                type: 'standard__objectPage',
                attributes: {
                    objectApiName: 'Account',
                    actionName: 'list'
                }
            }
        });
    }
}
