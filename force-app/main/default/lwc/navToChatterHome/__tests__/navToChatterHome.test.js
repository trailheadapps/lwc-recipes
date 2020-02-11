import { createElement } from 'lwc';
import NavToChatterHome from 'c/navToChatterHome';
import { getNavigateCalledWith } from 'lightning/navigation';
// This test uses a mocked navigation plugin.
// See force-app/test/jest-mocks/navigation.js for the mock
// and see jest.config.js for jest config to use the mock

describe('c-nav-to-chatter-home', () => {
    it('navigates to chatter home tab', () => {
        // Nav param values to test later
        const NAV_TYPE = 'standard__namedPage';
        const NAV_PAGE = 'chatter';

        // Create initial lwc element and attach to virtual DOM
        const element = createElement('c-nav-to-chatter-home', {
            is: NavToChatterHome
        });
        document.body.appendChild(element);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Get handle to button and fire click event
            const buttonEl = element.shadowRoot.querySelector(
                'lightning-button'
            );
            buttonEl.click();

            const { pageReference } = getNavigateCalledWith();

            // Verify component called with correct event type and params
            expect(pageReference.type).toBe(NAV_TYPE);
            expect(pageReference.attributes.pageName).toBe(NAV_PAGE);
        });
    });
});
