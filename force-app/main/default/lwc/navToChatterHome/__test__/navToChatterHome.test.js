import { createElement } from 'lwc';
import NavToChatterHome from 'c/navToChatterHome';
import { getNavigateCalledWith } from 'lightning/navigation';
// this test uses a mocked navigation plugin.
// see force-app/test/jest-mocks/navigation.js for the mock
// and see jest.config.js for jest config to use the mock

describe('c-nav-to-chatter-home', () => {
    it('navigates to chatter home tab', () => {
        //values to test later
        const NAV_TYPE = 'standard__namedPage';
        const NAV_PAGE = 'chatter';

        // boilerplate code to attach lwc element to virtual dom
        const element = createElement('c-nav-to-chatter-home', {
            is: NavToChatterHome
        });
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            const buttonEl = element.shadowRoot.querySelector(
                'lightning-button'
            );
            buttonEl.click();

            const { pageReference } = getNavigateCalledWith();

            // verify component called with correct event type
            expect(pageReference.type).toBe(NAV_TYPE);
            expect(pageReference.attributes.pageName).toBe(NAV_PAGE);
        });
    });
});
