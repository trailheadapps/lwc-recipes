import { LightningElement, wire } from 'lwc';
import {
    disableTabClose,
    IsConsoleNavigation,
    getFocusedTabInfo
} from 'lightning/platformWorkspaceApi';

export default class WorkspaceAPIDisableTabClose extends LightningElement {
    @wire(IsConsoleNavigation) isConsoleNavigation;

    async disableTabClose(event) {
        // Ensure that we're in a console app
        if (!this.isConsoleNavigation) {
            return;
        }

        // Toggle the ability to close the tab
        const close = event.detail.checked;
        const { tabId } = await getFocusedTabInfo();
        await disableTabClose(tabId, close);
    }
}
