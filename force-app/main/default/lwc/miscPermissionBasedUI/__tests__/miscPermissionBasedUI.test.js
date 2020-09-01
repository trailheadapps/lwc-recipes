import { createElement } from 'lwc';
import MiscPermissionBasedUI from 'c/miscPermissionBasedUI';

describe('c-misc-permission-based-u-i', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // This is a placeholder test that simulates the "assigned permission" behavior
    // of this component. Currently exploring correct way to mock the permission
    // values of true and undefined that are experienced at runtime.
    it('displays the correct UI when custom permission is true', () => {
        const element = createElement('c-misc-permission-based-u-i', {
            is: MiscPermissionBasedUI
        });
        document.body.appendChild(element);

        const pEl = element.shadowRoot.querySelector('p');
        expect(pEl.textContent).toBe('The permission set is assigned');
    });
});
