import { LightningElement, wire } from 'lwc';
import {
    IsConsoleNavigation,
    getFocusedTabInfo,
    setTabLabel
} from 'lightning/platformWorkspaceApi';

export default class WorkspaceAPISetTabLabel extends LightningElement {
    @wire(IsConsoleNavigation) isConsoleNavigation;

    async setTabLabel() {
        if (!this.isConsoleNavigation) {
            return;
        }
        const tabLabel = 'Awesome Label';
        const { tabId } = await getFocusedTabInfo();
        setTabLabel(tabId, tabLabel);
    }
}
