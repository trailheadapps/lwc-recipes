import { createElement } from 'lwc';
import NavToHome from 'c/navToHome';
import { getNavigateCalledWith } from 'lightning/navigation';

describe('c-nav-to-home', () => {
    // maybe not needed...there is just the one nav button
    // afterEach(() => {
    //     while (document.body.firstChild) {
    //         document.body.removeChild(document.body.firstChild);
    //     }
    // });

    it('navigates to home tab', () => {
        const NAV_TYPE = 'standard__namedPage';
        const NAV_PAGE = 'home';

        const element = createElement('c-nav-to-home', {
            is: NavToHome
        });
        document.body.appendChild(element)

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
    })
})