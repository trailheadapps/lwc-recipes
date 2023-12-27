import { LightningElement, wire } from 'lwc';
import { EnclosingTabId, openSubtab } from 'lightning/platformWorkspaceApi';

export default class WorkspaceAPIOpenSubtab extends LightningElement {
    @wire(EnclosingTabId) enclosingTabId;

    findEnclosingTabAndOpenSubtab() {
        if (!this.enclosingTabId) {
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
