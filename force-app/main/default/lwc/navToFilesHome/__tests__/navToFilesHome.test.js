import { createElement } from 'lwc';
import NavToFilesHome from 'c/navToFilesHome';
import { getNavigateCalledWith } from 'lightning/navigation';
// This test uses a mocked navigation plugin.
// See force-app/test/jest-mocks/navigation.js for the mock
// and see jest.config.js for jest config to use the mock

describe('c-nav-to-files-home', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.
    async function flushPromises() {
        return Promise.resolve();
    }

    it('navigates to files home tab', async () => {
        // Nav param values to test later
        const NAV_TYPE = 'standard__objectPage';
        const NAV_OBJECT_API_NAME = 'ContentDocument';
        const NAV_ACTION_NAME = 'home';

        // Create initial lwc element and attach to virtual DOM
        const element = createElement('c-nav-to-files-home', {
            is: NavToFilesHome
        });
        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Get handle to button and fire click event
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        const { pageReference } = getNavigateCalledWith();

        // Verify component called with correct event type and params
        expect(pageReference.type).toBe(NAV_TYPE);
        expect(pageReference.attributes.objectApiName).toBe(
            NAV_OBJECT_API_NAME
        );
        expect(pageReference.attributes.actionName).toBe(NAV_ACTION_NAME);
    });

    it('is accessible', async () => {
        const element = createElement('c-nav-to-files-home', {
            is: NavToFilesHome
        });

        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });
});
