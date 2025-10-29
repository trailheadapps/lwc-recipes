import { createElement } from '@lwc/engine-dom';
import WorkspaceAPISetTabLabel from 'c/workspaceAPISetTabLabel';
import {
    IsConsoleNavigation,
    getFocusedTabInfo,
    setTabLabel,
    FOCUSED_TAB_ID
} from 'lightning/platformWorkspaceApi';

const UPDATED_TAB_LABEL = 'Awesome Label';

describe('c-workspace-api-set-tab-label', () => {
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
        const element = createElement('c-workspace-api-set-tab-label', {
            is: WorkspaceAPISetTabLabel
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
        expect(setTabLabel).toHaveBeenCalledWith(
            FOCUSED_TAB_ID,
            UPDATED_TAB_LABEL
        );
    });

    it('is accessible', async () => {
        // Create component
        const element = createElement('c-workspace-api-set-tab-label', {
            is: WorkspaceAPISetTabLabel
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
