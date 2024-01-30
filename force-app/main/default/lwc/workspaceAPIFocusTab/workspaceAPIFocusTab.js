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
        if (!this.isConsoleNavigation) {
            return;
        }
        const { tabId } = await getFocusedTabInfo();
        const allTabs = await getAllTabInfo();
        const selectedTabIndex = allTabs.findIndex(
            (possibleNextTab) => possibleNextTab.tabId === tabId
        );
        const nextTabId = allTabs[selectedTabIndex + 1].tabId;

        await focusTab(nextTabId);
    }
}
