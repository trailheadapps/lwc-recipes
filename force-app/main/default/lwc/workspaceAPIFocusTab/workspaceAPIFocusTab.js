import { LightningElement, wire } from 'lwc';
import {
    focusTab,
    IsConsoleNavigation,
    getFocusedTabInfo,
    getAllTabInfo
} from 'lightning/platformWorkspaceApi';

export default class WorkspaceAPIFocusTab extends LightningElement {
    @wire(IsConsoleNavigation) isConsoleNavigation;

    async focusNextTab() {
        // Ensure that we're in a console app
        if (!this.isConsoleNavigation) {
            return;
        }

        // Get current tab and figure out which tab is next
        const { tabId } = await getFocusedTabInfo();
        const allTabs = await getAllTabInfo();
        const selectedTabIndex = allTabs.findIndex(
            (possibleNextTab) => possibleNextTab.tabId === tabId
        );
        const nextTabId = allTabs[selectedTabIndex + 1].tabId;

        // Focus on next tab
        await focusTab(nextTabId);
    }
}
