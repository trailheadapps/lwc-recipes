import { createElement } from 'lwc';
import {
    focusTab,
    IsConsoleNavigation,
    getFocusedTabInfo,
    getAllTabInfo,
    TAB1
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

        // Simulate console navigation
        IsConsoleNavigation.emit(true);

        // Find and click button
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Wait for async event
        await flushPromises();

        // Check that related platformWorkspaceApi functions have been called
        expect(getFocusedTabInfo).toHaveBeenCalled();
        expect(getAllTabInfo).toHaveBeenCalled();
        // Based on our mock, next tab that receives focus should be TAB1
        expect(focusTab).toHaveBeenCalledWith(TAB1);
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
