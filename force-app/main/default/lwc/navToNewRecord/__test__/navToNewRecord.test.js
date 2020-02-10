import { createElement } from 'lwc';
import NavToNewRecord from 'c/navToNewRecord';
import { getNavigateCalledWith } from 'lightning/navigation';
// this test uses a mocked navigation plugin.
// see force-app/test/jest-mocks/navigation.js for the mock
// and see jest.config.js for jest config to use the mock

describe('c-nav-to-new-record', () => {
    it('navigates to new record', () => {
        // nav param values to test later
        const NAV_TYPE = 'standard__objectPage';
        const NAV_OBJECT_API_NAME = 'Contact';
        const NAV_ACTION_NAME = 'new';

        // boilerplate code to create lwc and attach to virtual DOM
        const element = createElement('c-nav-to-new-record', {
            is: NavToNewRecord
        });
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            // get handle to button and invoke click
            const buttonEl = element.shadowRoot.querySelector(
                'lightning-button'
            );
            buttonEl.click();

            const { pageReference } = getNavigateCalledWith();

            // verify component called with correct event type ane params
            expect(pageReference.type).toBe(NAV_TYPE);
            expect(pageReference.attributes.objectApiName).toBe(
                NAV_OBJECT_API_NAME
            );
            expect(pageReference.attributes.actionName).toBe(NAV_ACTION_NAME);
        });
    });
});
