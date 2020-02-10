import { createElement } from 'lwc';
import NavToHelloTab from 'c/navToHelloTab';
import { getNavigateCalledWith } from 'lightning/navigation';

describe('c-nav-to-hello-tab', () => {
    // maybe not needed...there is just the one nav button
    // afterEach(() => {
    //     while (document.body.firstChild) {
    //         document.body.removeChild(document.body.firstChild);
    //     }
    // });

    it('navigates to hello tab', () => {
        const NAV_TYPE = 'standard__navItemPage';
        const NAV_API_NAME = 'Hello';

        const element = createElement('c-nav-to-home', {
            is: NavToHelloTab
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
            expect(pageReference.attributes.apiName).toBe(NAV_API_NAME);
        });
    });
});
