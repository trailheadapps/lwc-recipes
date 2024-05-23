import { createElement } from 'lwc';
import WorkspaceAPI from 'c/workspaceAPI';
import { getNavigateCalledWith } from 'lightning/navigation';
import { IsConsoleNavigation } from 'lightning/platformWorkspaceApi';

describe('c-workspace-api', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling async functions
    async function flushPromises() {
        return Promise.resolve();
    }

    it('navigates to Workspace API page when Take me there! button clicked', async () => {
        const API_NAME = 'Workspace_API';
        const INPUT_TYPE = 'standard__navItemPage';

        // Create component
        const element = createElement('c-workspace-api', {
            is: WorkspaceAPI
        });
        document.body.appendChild(element);

        // Simulate console navigation
        IsConsoleNavigation.emit(true);
        await flushPromises();

        // Find and click button
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Verify the component under test called the correct navigate event
        // type and sent the expected api name
        const { pageReference } = getNavigateCalledWith();
        expect(pageReference.type).toBe(INPUT_TYPE);
        expect(pageReference.attributes.apiName).toBe(API_NAME);
    });

    it('is accessible', async () => {
        const element = createElement('c-workspace-api', {
            is: WorkspaceAPI
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
