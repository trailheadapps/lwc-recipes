import { createElement } from 'lwc';
import ViewSource from 'c/viewSource';

describe('c-view-source', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders an a href that points to the LWC Recipes GitHub repo', () => {
        const BASE_URL =
            'https://github.com/trailheadapps/lwc-recipes/tree/master/force-app/main/default/';
        const LWC_PARAMETER = 'superLwc';
        const RESULT = BASE_URL + LWC_PARAMETER;

        const element = createElement('c-contact-list', {
            is: ViewSource
        });
        element.source = LWC_PARAMETER;
        document.body.appendChild(element);

        const linkEl = element.shadowRoot.querySelector('a');
        expect(linkEl.href).toBe(RESULT);
    });
});
