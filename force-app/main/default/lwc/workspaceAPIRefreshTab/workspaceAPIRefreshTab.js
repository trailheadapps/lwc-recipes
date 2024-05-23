import { LightningElement, wire } from 'lwc';
import {
    IsConsoleNavigation,
    getFocusedTabInfo,
    refreshTab
} from 'lightning/platformWorkspaceApi';

export default class WorkspaceAPIRefreshTab extends LightningElement {
    @wire(IsConsoleNavigation) isConsoleNavigation;

    async refreshTab() {
        // Ensure that we're in a console app
        if (!this.isConsoleNavigation) {
            return;
        }

        // Refresh current tab
        const { tabId } = await getFocusedTabInfo();
        await refreshTab(tabId, {
            includeAllSubtabs: true
        });
    }
}
