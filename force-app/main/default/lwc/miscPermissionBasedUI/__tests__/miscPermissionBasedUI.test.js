import { createElement } from 'lwc';
import MiscPermissionBasedUI from 'c/miscPermissionBasedUI';
import hasAccessRestrictedUI from '@salesforce/customPermission/accessRestrictedUIPermission';

// Mocking custom permission module
jest.mock(
    '@salesforce/customPermission/accessRestrictedUIPermission',
    () => {
        return {
            default: jest.fn()
        };
    },
    { virtual: true }
);

describe('c-misc-permission-based-u-i', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('displays the correct UI when custom permission is true', () => {
        const element = createElement('c-misc-permission-based-u-i', {
            is: MiscPermissionBasedUI
        });

        hasAccessRestrictedUI.mockReturnValueOnce(true);

        document.body.appendChild(element);

        const pEl = element.shadowRoot.querySelector('p');
        expect(pEl.textContent).toBe('The permission set is assigned');
    });

    it('displays the correct UI when custom permission is undefined', () => {
        const element = createElement('c-misc-permission-based-u-i', {
            is: MiscPermissionBasedUI
        });

        hasAccessRestrictedUI.mockReturnValueOnce(undefined);

        document.body.appendChild(element);

        const pEl = element.shadowRoot.querySelector('p');
        expect(pEl.textContent).toBe('The permission set is assigned');
    });

    it('is accessible when custom permission is true', () => {
        const element = createElement('c-misc-permission-based-u-i', {
            is: MiscPermissionBasedUI
        });

        hasAccessRestrictedUI.mockReturnValueOnce(true);

        document.body.appendChild(element);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });

    it('is accessible when custom permission is false', () => {
        const element = createElement('c-misc-permission-based-u-i', {
            is: MiscPermissionBasedUI
        });

        hasAccessRestrictedUI.mockReturnValueOnce(undefined);

        document.body.appendChild(element);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });
});
