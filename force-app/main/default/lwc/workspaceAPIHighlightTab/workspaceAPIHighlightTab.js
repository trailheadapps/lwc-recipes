import { LightningElement, wire } from 'lwc';
import {
    IsConsoleNavigation,
    getFocusedTabInfo,
    setTabHighlighted
} from 'lightning/platformWorkspaceApi';

export default class WorkspaceAPIHighlightTab extends LightningElement {
    @wire(IsConsoleNavigation) isConsoleNavigation;

    async highlightTab(event) {
        // Ensure that we're in a console app
        if (!this.isConsoleNavigation) {
            return;
        }

        // Toggle highlight for current tab
        const highlighted = event.detail.checked;
        const { tabId } = await getFocusedTabInfo();
        setTabHighlighted(tabId, highlighted, {
            pulse: true,
            state: 'success'
        });
    }
}
