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
            'https://github.com/trailheadapps/lwc-recipes/tree/main/force-app/main/default/';
        const LWC_PARAMETER = 'superLwc';
        const RESULT = BASE_URL + LWC_PARAMETER;

        // Create component
        const element = createElement('c-contact-list', {
            is: ViewSource
        });
        // Set public properties
        element.source = LWC_PARAMETER;
        document.body.appendChild(element);

        // Select element for validation
        const linkEl = element.shadowRoot.querySelector('a');
        expect(linkEl.href).toBe(RESULT);
    });

    it('is accessible', async () => {
        const element = createElement('c-view-source', {
            is: ViewSource
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
