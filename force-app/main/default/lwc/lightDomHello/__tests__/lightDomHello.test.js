import { createElement } from 'lwc';
import LightDomHello from 'c/lightDomHello';

describe('c-light-dom-hello', () => {
    //Enable light DOM. This is a work around, and it can be removed with the next update of sfdx-lwc-jest.
    // eslint-disable-next-line no-undef
    lwcRuntimeFlags.ENABLE_LIGHT_DOM_COMPONENTS = true;

    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('displays greeting in light DOM', () => {
        const element = createElement('c-light-dom-hello', {
            is: LightDomHello
        });
        document.body.appendChild(element);

        // Verify displayed greeting
        const divEl = element.querySelector('div');
        expect(divEl.textContent).toBe('Hello from Light DOM!');
    });

    it('is accessible', async () => {
        const element = createElement('c-light-dom-hello', {
            is: LightDomHello
        });

        document.body.appendChild(element);

        //Verify component is accessible
        await expect(element).toBeAccessible();
    });
});
