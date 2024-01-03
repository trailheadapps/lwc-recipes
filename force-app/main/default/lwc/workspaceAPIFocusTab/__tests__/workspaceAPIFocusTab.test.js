import { createElement } from 'lwc';
import {
    focusTab,
    IsConsoleNavigation,
    getFocusedTabInfo,
    getAllTabInfo,
    FOCUSED_TAB
} from 'lightning/platformWorkspaceApi';
import WorkspaceAPIFocusTab from 'c/workspaceAPIFocusTab';

describe('c-workspace-api-focus-tab', () => {
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
        const element = createElement('c-workspace-api-focus-tab', {
            is: WorkspaceAPIFocusTab
        });
        document.body.appendChild(element);

        IsConsoleNavigation.emit(true);

        // Query lightning-button component element
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        await flushPromises();

        // Compare if related platformWorkspaceApi functions have been called
        expect(getFocusedTabInfo).toHaveBeenCalled();
        expect(getAllTabInfo).toHaveBeenCalled();
        const allTabs = await getAllTabInfo();
        const selectedTabIndex = allTabs.findIndex(
            (possibleNextTab) => possibleNextTab.tabId === FOCUSED_TAB
        );
        const nextTabId = allTabs[selectedTabIndex + 1].tabId;
        expect(focusTab).toHaveBeenCalledWith(nextTabId);
    });

    it('is accessible', async () => {
        // Create component
        const element = createElement('c-workspace-api-focus-tab', {
            is: WorkspaceAPIFocusTab
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
