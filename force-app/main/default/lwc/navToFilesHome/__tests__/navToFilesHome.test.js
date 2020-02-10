import { createElement } from 'lwc';
import NavToFilesHome from 'c/navToFilesHome';
import { getNavigateCalledWith } from 'lightning/navigation';

describe('c-nav-to-files-home', () => {
    it('navigates to files home tab', () => {
        // nav params to test later
        const NAV_TYPE = 'standard__objectPage';
        const NAV_OBJECT_API_NAME = 'ContentDocument';
        const NAV_ACTION_NAME = 'home';

        // boilerplate code to attach lwc to virtual DOM
        const element = createElement('c-nav-to-files-home', {
            is: NavToFilesHome
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
            expect(pageReference.attributes.objectApiName).toBe(
                NAV_OBJECT_API_NAME
            );
            expect(pageReference.attributes.actionName).toBe(NAV_ACTION_NAME);
        });
    });
});
