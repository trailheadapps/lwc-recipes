import { LightningElement, wire } from 'lwc';
import {
    IsConsoleNavigation,
    getFocusedTabInfo,
    refreshTab
} from 'lightning/platformWorkspaceApi';

export default class WorkspaceAPIRefreshTab extends LightningElement {
    @wire(IsConsoleNavigation) isConsoleNavigation;

    async refreshTab() {
        if (!this.isConsoleNavigation) {
            return;
        }
        const { tabId } = await getFocusedTabInfo();
        await refreshTab(tabId, {
            includeAllSubtabs: true
        });
    }
}
