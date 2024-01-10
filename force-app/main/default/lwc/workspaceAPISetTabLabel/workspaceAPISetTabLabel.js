import { LightningElement, wire } from 'lwc';
import {
    IsConsoleNavigation,
    getFocusedTabInfo,
    setTabLabel
} from 'lightning/platformWorkspaceApi';

const TAB_LABEL = 'Awesome Label';

export default class WorkspaceAPISetTabLabel extends LightningElement {
    @wire(IsConsoleNavigation) isConsoleNavigation;

    async setTabLabel() {
        if (!this.isConsoleNavigation) {
            return;
        }
        const { tabId } = await getFocusedTabInfo();
        setTabLabel(tabId, TAB_LABEL);
    }
}
