import { createElement } from 'lwc';
import NavToListView from 'c/navToListView';
import { getNavigateCalledWith } from 'lightning/navigation';
// this test uses a mocked navigation plugin.
// see force-app/test/jest-mocks/navigation.js for the mock
// and see jest.config.js for jest config to use the mock

describe('c-nav-to-list-view', () => {
    it('navigates to list view', () => {
        // nav params to test later
        const NAV_TYPE = 'standard__objectPage';
        const NAV_OBJECT_API_NAME = 'Contact';
        const NAV_ACTION_NAME = 'list';
        const NAV_FILTER_NAME = 'Recent';

        // boilerplate code to create lwc and attach to virtual DOM
        const element = createElement('c-nav-to-list-view', {
            is: NavToListView
        });
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            // get handle to button and trigger the event
            const buttonEl = element.shadowRoot.querySelector(
                'lightning-button'
            );
            buttonEl.click();

            const { pageReference } = getNavigateCalledWith();

            // verify component called with correct event and params
            expect(pageReference.type).toBe(NAV_TYPE);
            expect(pageReference.attributes.objectApiName).toBe(
                NAV_OBJECT_API_NAME
            );
            expect(pageReference.attributes.actionName).toBe(NAV_ACTION_NAME);
            expect(pageReference.state.filterName).toBe(NAV_FILTER_NAME);
        });
    });
});
