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
        // Ensure that we're in a console app
        if (!this.isConsoleNavigation) {
            return;
        }

        // Change current tab label
        const { tabId } = await getFocusedTabInfo();
        setTabLabel(tabId, TAB_LABEL);
    }
}
