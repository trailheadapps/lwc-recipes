import { createElement } from 'lwc';
import WorkspaceAPISetTabIcon from 'c/workspaceAPISetTabIcon';
import {
    IsConsoleNavigation,
    getFocusedTabInfo,
    setTabIcon,
    FOCUSED_TAB
} from 'lightning/platformWorkspaceApi';

describe('c-workspace-api-set-tab-icon', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling async functions
    async function flushPromises() {
        return Promise.resolve();
    }

    it('Calls the related platformWorkspaceApi methods', async () => {
        // Create component
        const element = createElement('c-workspace-api-set-tab-icon', {
            is: WorkspaceAPISetTabIcon
        });
        document.body.appendChild(element);

        const TAB_ICON = 'utility:animal_and_nature';
        const TAB_ICON_ALT_TEXT = 'Animal and Nature';
        IsConsoleNavigation.emit(true);

        // Query lightning-button component element
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        await flushPromises();

        // Compare if related platformWorkspaceApi functions have been called
        expect(getFocusedTabInfo).toHaveBeenCalled();
        expect(setTabIcon).toHaveBeenCalledWith(FOCUSED_TAB, TAB_ICON, {
            iconAlt: TAB_ICON_ALT_TEXT
        });
    });

    it('is accessible', async () => {
        // Create component
        const element = createElement('c-workspace-api-set-tab-icon', {
            is: WorkspaceAPISetTabIcon
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
