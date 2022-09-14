import { createElement } from 'lwc';
import NavToHelloTab from 'c/navToHelloTab';
import { getNavigateCalledWith } from 'lightning/navigation';
// this test uses a mocked navigation plugin.
// see force-app/test/jest-mocks/navigation.js for the mock
// and see jest.config.js for jest config to use the mock

describe('c-nav-to-hello-tab', () => {
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

    it('navigates to hello tab', async () => {
        const NAV_TYPE = 'standard__navItemPage';
        const NAV_API_NAME = 'Hello';

        // boilerplate code to create lwc element and attach to DOM
        const element = createElement('c-nav-to-hello-tab', {
            is: NavToHelloTab
        });
        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // get handle to button and fire click event
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        const { pageReference } = getNavigateCalledWith();

        // verify component called with correct event type
        expect(pageReference.type).toBe(NAV_TYPE);
        expect(pageReference.attributes.apiName).toBe(NAV_API_NAME);
    });

    it('is accessible', async () => {
        const element = createElement('c-nav-to-hello-tab', {
            is: NavToHelloTab
        });

        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });
});
