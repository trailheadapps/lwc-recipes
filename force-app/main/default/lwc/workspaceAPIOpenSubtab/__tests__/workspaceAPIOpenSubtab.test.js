import { createElement } from 'lwc';
import WorkspaceAPIOpenSubtab from 'c/workspaceAPIOpenSubtab';
import {
    IsConsoleNavigation,
    EnclosingTabId,
    openSubtab,
    ENCLOSING_TAB_ID
} from 'lightning/platformWorkspaceApi';

describe('c-workspace-api-open-subtab', () => {
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
        const element = createElement('c-workspace-api-open-subtab', {
            is: WorkspaceAPIOpenSubtab
        });
        document.body.appendChild(element);

        const enclosingTabId = 'tab0';
        IsConsoleNavigation.emit(true);
        EnclosingTabId.emit(enclosingTabId);

        // Query lightning-button component element
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        await flushPromises();

        // Compare if related platformWorkspaceApi functions have been called
        expect(openSubtab).toHaveBeenCalledWith(ENCLOSING_TAB_ID, {
            pageReference: {
                type: 'standard__objectPage',
                attributes: {
                    objectApiName: 'Account',
                    actionName: 'list'
                }
            }
        });
    });

    it('is accessible', async () => {
        // Create component
        const element = createElement('c-workspace-api-open-subtab', {
            is: WorkspaceAPIOpenSubtab
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
