import { createElement } from 'lwc';
import WorkspaceAPI from 'c/workspaceAPI';
import { getNavigateCalledWith } from 'lightning/navigation';

describe('c-workspace-api', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    it('navigates to Workspace API page when Take me there! button clicked', async () => {
        const API_NAME = 'Workspace_API';
        const INPUT_TYPE = 'standard__navItemPage';

        // Create component
        const element = createElement('c-workspace-api', {
            is: WorkspaceAPI
        });
        document.body.appendChild(element);

        // Click button
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Verify the component under test called the correct navigate event
        // type and sent the expected recordId defined above
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
