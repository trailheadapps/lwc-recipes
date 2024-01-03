import { createElement } from 'lwc';
import WorkspaceAPISetTabLabel from 'c/workspaceAPISetTabLabel';
import {
    IsConsoleNavigation,
    getFocusedTabInfo,
    setTabLabel,
    FOCUSED_TAB
} from 'lightning/platformWorkspaceApi';

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

        const TAB_LABEL = 'Awesome Label';
        IsConsoleNavigation.emit(true);

        // Query lightning-button component element
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        await flushPromises();

        // Compare if related platformWorkspaceApi functions have been called
        expect(getFocusedTabInfo).toHaveBeenCalled();
        expect(setTabLabel).toHaveBeenCalledWith(FOCUSED_TAB, TAB_LABEL);
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
