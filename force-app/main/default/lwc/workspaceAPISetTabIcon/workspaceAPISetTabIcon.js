import { LightningElement, wire } from 'lwc';
import {
    IsConsoleNavigation,
    getFocusedTabInfo,
    setTabIcon
} from 'lightning/platformWorkspaceApi';

const TAB_ICON = 'utility:animal_and_nature';
const TAB_ICON_ALT_TEXT = 'Animal and Nature';

export default class WorkspaceAPISetTabIcon extends LightningElement {
    @wire(IsConsoleNavigation) isConsoleNavigation;

    async setTabIcon() {
        // Ensure that we're in a console app
        if (!this.isConsoleNavigation) {
            return;
        }

        // Change current tab icon
        const { tabId } = await getFocusedTabInfo();
        setTabIcon(tabId, TAB_ICON, {
            iconAlt: TAB_ICON_ALT_TEXT
        });
    }
}
