import { createElement } from 'lwc';
import WorkspaceAPIOpenTab from 'c/workspaceAPIOpenTab';
import { IsConsoleNavigation, openTab } from 'lightning/platformWorkspaceApi';

describe('c-workspace-api-open-tab', () => {
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
        const element = createElement('c-workspace-api-open-tab', {
            is: WorkspaceAPIOpenTab
        });
        document.body.appendChild(element);

        IsConsoleNavigation.emit(true);

        // Query lightning-button component element
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        await flushPromises();

        // Compare if related platformWorkspaceApi functions have been called
        expect(openTab).toHaveBeenCalledWith({
            pageReference: {
                type: 'standard__objectPage',
                attributes: {
                    objectApiName: 'Contact',
                    actionName: 'list'
                }
            },
            focus: true,
            label: 'Contacts List'
        });
    });

    it('is accessible', async () => {
        // Create component
        const element = createElement('c-workspace-api-open-tab', {
            is: WorkspaceAPIOpenTab
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
