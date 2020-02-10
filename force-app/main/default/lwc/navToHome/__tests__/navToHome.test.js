import { createElement } from 'lwc';
import NavToHome from 'c/navToHome';
import { getNavigateCalledWith } from 'lightning/navigation';
// this test uses a mocked navigation plugin.
// see force-app/test/jest-mocks/navigation.js for the mock
// and see jest.config.js for jest config to use the mock

describe('c-nav-to-home', () => {
    it('navigates to home tab', () => {
        // nav param values to test later
        const NAV_TYPE = 'standard__namedPage';
        const NAV_PAGE = 'home';

        // boilerplate code to create lwc element and attach to DOM
        const element = createElement('c-nav-to-home', {
            is: NavToHome
        });
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            // get handle to button and fire click event
            const buttonEl = element.shadowRoot.querySelector(
                'lightning-button'
            );
            buttonEl.click();

            const { pageReference } = getNavigateCalledWith();

            // verify component called with correct event type and params
            expect(pageReference.type).toBe(NAV_TYPE);
            expect(pageReference.attributes.pageName).toBe(NAV_PAGE);
        });
    });
});
