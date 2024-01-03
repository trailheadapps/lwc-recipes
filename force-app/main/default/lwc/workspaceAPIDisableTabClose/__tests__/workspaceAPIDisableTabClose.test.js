import { createElement } from 'lwc';
import {
    disableTabClose,
    IsConsoleNavigation,
    getFocusedTabInfo,
    FOCUSED_TAB
} from 'lightning/platformWorkspaceApi';

import WorkspaceAPIDisableTabClose from 'c/workspaceAPIDisableTabClose';

describe('c-workspace-api-disable-tab-close', () => {
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
        const element = createElement('c-workspace-api-disable-tab-close', {
            is: WorkspaceAPIDisableTabClose
        });
        document.body.appendChild(element);

        IsConsoleNavigation.emit(true);

        // Query lightning-input component element
        const inputEl = element.shadowRoot.querySelector('lightning-input');
        const toggleValue = true;
        inputEl.dispatchEvent(
            new CustomEvent('change', { detail: { checked: toggleValue } })
        );

        await flushPromises();

        // Compare if related platformWorkspaceApi functions have been called
        expect(getFocusedTabInfo).toHaveBeenCalled();
        expect(disableTabClose).toHaveBeenCalledWith(FOCUSED_TAB, toggleValue);
    });

    it('is accessible', async () => {
        // Create component
        const element = createElement('c-workspace-api-disable-tab-close', {
            is: WorkspaceAPIDisableTabClose
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
