import { LightningElement, wire } from 'lwc';
import {
    IsConsoleNavigation,
    getFocusedTabInfo,
    setTabHighlighted
} from 'lightning/platformWorkspaceApi';

export default class WorkspaceAPIHighlightTab extends LightningElement {
    @wire(IsConsoleNavigation) isConsoleNavigation;

    async highlightTab(event) {
        if (!this.isConsoleNavigation) {
            return;
        }
        const highlighted = event.detail.checked;
        const { tabId } = await getFocusedTabInfo();
        setTabHighlighted(tabId, highlighted, {
            pulse: true,
            state: 'success'
        });
    }
}
