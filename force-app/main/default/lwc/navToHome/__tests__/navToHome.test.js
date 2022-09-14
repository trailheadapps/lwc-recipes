import { createElement } from 'lwc';
import NavToHome from 'c/navToHome';
import { getNavigateCalledWith } from 'lightning/navigation';
// This test uses a mocked navigation plugin.
// See force-app/test/jest-mocks/navigation.js for the mock
// and see jest.config.js for jest config to use the mock

describe('c-nav-to-home', () => {
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

    it('navigate mock should be empty (before)', async () => {
        const element = createElement('c-nav-to-home', {
            is: NavToHome
        });
        document.body.appendChild(element);
        await flushPromises();
        const { pageReference } = getNavigateCalledWith();
        expect(pageReference).toBeUndefined();
    });

    it('navigates to home tab', async () => {
        // Nav param values to test later
        const NAV_TYPE = 'standard__namedPage';
        const NAV_PAGE = 'home';

        // Create initial lwc element and attach to virtual DOM
        const element = createElement('c-nav-to-home', {
            is: NavToHome
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
        expect(pageReference.attributes.pageName).toBe(NAV_PAGE);
    });

    // THIS TEST UNEXPECTEDLY FAILS.
    it('navigate mock should be empty (after)', async () => {
        const element = createElement('c-nav-to-home', {
            is: NavToHome
        });
        document.body.appendChild(element);
        await flushPromises();
        const { pageReference } = getNavigateCalledWith();
        expect(pageReference).toBeUndefined();
        //                    ^ THIS FAILS
        // expect(received).toBeUndefined()
        // Received: {"attributes": {"pageName": "home"}, "type": "standard__namedPage"}
    });

    it('is accessible', async () => {
        const element = createElement('c-nav-to-home', {
            is: NavToHome
        });

        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });
});
