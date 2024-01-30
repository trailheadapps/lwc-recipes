import { createElement } from 'lwc';
import CompositionBasics from 'c/compositionBasics';

describe('c-composition-basics', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders one contact tile', () => {
        // Create component
        const element = createElement('c-composition-basics', {
            is: CompositionBasics
        });
        document.body.appendChild(element);

        // Select rendered contact tile for length check
        const contactTileEls =
            element.shadowRoot.querySelectorAll('c-contact-tile');
        expect(contactTileEls.length).toBe(1);
    });

    it('renders with contact tile properties set', () => {
        const USER_RESULT = 'Amy Taylor';
        const TITLE_RESULT = 'VP of Engineering';

        // Create component
        const element = createElement('c-composition-basics', {
            is: CompositionBasics
        });
        document.body.appendChild(element);

        // Select contact tile for public property check
        const contactTileEl =
            element.shadowRoot.querySelector('c-contact-tile');
        expect(contactTileEl.contact.Name).toBe(USER_RESULT);
        expect(contactTileEl.contact.Title).toBe(TITLE_RESULT);
    });

    it('is accessible', async () => {
        // Create component
        const element = createElement('c-composition-basics', {
            is: CompositionBasics
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
