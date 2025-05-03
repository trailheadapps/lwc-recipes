import { createElement } from 'lwc';
import NavToNewRecord from 'c/navToNewRecord';
import { getNavigateCalledWith } from 'lightning/navigation';
// This test uses a mocked navigation plugin.
// See force-app/test/jest-mocks/navigation.js for the mock
// and see jest.config.js for jest config to use the mock

describe('c-nav-to-new-record', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Reset the navigation mock between tests
        jest.clearAllMocks();
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.
    async function flushPromises() {
        return Promise.resolve();
    }

    it('navigates to new record', async () => {
        // Nav param values to test later
        const NAV_TYPE = 'standard__objectPage';
        const NAV_OBJECT_API_NAME = 'Contact';
        const NAV_ACTION_NAME = 'new';

        // Create initial lwc element and attach to virtual DOM
        const element = createElement('c-nav-to-new-record', {
            is: NavToNewRecord
        });
        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Get handle to button and invoke click
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
        const element = createElement('c-nav-to-new-record', {
            is: NavToNewRecord
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
