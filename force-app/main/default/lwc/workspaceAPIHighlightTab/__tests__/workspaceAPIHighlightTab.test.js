import { createElement } from 'lwc';
import WorkspaceAPIHighlightTab from 'c/workspaceAPIHighlightTab';
import {
    IsConsoleNavigation,
    getFocusedTabInfo,
    setTabHighlighted,
    FOCUSED_TAB
} from 'lightning/platformWorkspaceApi';

describe('c-workspace-api-highlight-tab', () => {
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
        const element = createElement('c-workspace-api-highlight-tab', {
            is: WorkspaceAPIHighlightTab
        });
        document.body.appendChild(element);

        IsConsoleNavigation.emit(true);

        // Query lightning-input component element
        const inputEl = element.shadowRoot.querySelector('lightning-input');
        inputEl.dispatchEvent(
            new CustomEvent('change', { detail: { checked: true } })
        );

        await flushPromises();

        // Compare if related platformWorkspaceApi functions have been called
        expect(getFocusedTabInfo).toHaveBeenCalled();
        expect(setTabHighlighted).toHaveBeenCalledWith(FOCUSED_TAB, true, {
            pulse: true,
            state: 'success'
        });
    });

    it('is accessible', async () => {
        // Create component
        const element = createElement('c-workspace-api-highlight-tab', {
            is: WorkspaceAPIHighlightTab
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
