import { LightningElement, wire } from 'lwc';
import {
    IsConsoleNavigation,
    getFocusedTabInfo,
    setTabIcon
} from 'lightning/platformWorkspaceApi';

export default class WorkspaceAPISetTabIcon extends LightningElement {
    @wire(IsConsoleNavigation) isConsoleNavigation;

    async setTabIcon() {
        if (!this.isConsoleNavigation) {
            return;
        }
        const tabIcon = 'utility:animal_and_nature';
        const tabIconAltText = 'Animal and Nature';
        const { tabId } = await getFocusedTabInfo();
        setTabIcon(tabId, tabIcon, {
            iconAlt: tabIconAltText
        });
    }
}
