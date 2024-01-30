import { LightningElement, wire } from 'lwc';
import {
    disableTabClose,
    IsConsoleNavigation,
    getFocusedTabInfo
} from 'lightning/platformWorkspaceApi';

export default class WorkspaceAPIDisableTabClose extends LightningElement {
    @wire(IsConsoleNavigation) isConsoleNavigation;

    async disableTabClose(event) {
        if (!this.isConsoleNavigation) {
            return;
        }
        const close = event.detail.checked;
        const { tabId } = await getFocusedTabInfo();
        await disableTabClose(tabId, close);
    }
}
