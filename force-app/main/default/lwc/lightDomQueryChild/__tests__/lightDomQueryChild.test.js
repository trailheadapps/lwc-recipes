import { createElement } from 'lwc';
import LightDomQueryChild from 'c/lightDomQueryChild';

describe('c-light-dom-query-child', () => {
    // Enable light DOM. This is a work around, and it can be removed with the next update of sfdx-lwc-jest.
    // eslint-disable-next-line no-undef
    lwcRuntimeFlags.ENABLE_LIGHT_DOM_COMPONENTS = true;

    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('changes inner text in the paragraph element', () => {
        const BUTTON_LABEL = 'Change Text';
        const PARAGRAPH_TEXT = 'Text changed by child';

        const element = createElement('c-light-dom-query-child', {
            is: LightDomQueryChild
        });
        document.body.appendChild(element);

        // Query the lightning-button element and click it
        const lightningButtonEl = element.querySelector('lightning-button');
        lightningButtonEl.click();

        // Verify the 'Change Text' button is clicked
        expect(lightningButtonEl.label).toBe(BUTTON_LABEL);

        // Verify light DOM paragraph text is changed
        const pEl = element.querySelector('p.lightDomParagraph');
        expect(pEl.innerText).toBe(PARAGRAPH_TEXT);
    });

    it('is accessible', async () => {
        const element = createElement('c-light-dom-query-child', {
            is: LightDomQueryChild
        });
        document.body.appendChild(element);

        // Verify component is accessible
        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
