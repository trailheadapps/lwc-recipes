import { createElement } from 'lwc';
import MiscPermissionBasedUI from 'c/miscPermissionBasedUI';

// Mocking custom permission module
const mockModule = {
    __esModule: true
};

const mockPermission = jest.fn();

jest.mock(
    '@salesforce/customPermission/accessRestrictedUIPermission',
    () => mockPermission(),
    { virtual: true }
);

describe('c-misc-permission-based-u-i', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.
    async function flushPromises() {
        return Promise.resolve();
    }

    it('displays the correct UI when custom permission is true', async () => {
        mockPermission.mockReturnValueOnce({
            ...mockModule,
            default: true
        });

        const element = createElement(
            'c-misc-permission-based-u-i', {
                is: MiscPermissionBasedUI
        });

        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        const pEl = element.shadowRoot.querySelector('p');
        expect(pEl.textContent).toBe('The permission set is assigned');
    });

    it('displays the correct UI when custom permission is undefined', async () => {
        mockPermission.mockReturnValueOnce({
            ...mockModule,
            default: undefined
        });

        const element = createElement(
            'c-misc-permission-based-u-i', {
                is: MiscPermissionBasedUI
        });

        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        const pEl = element.shadowRoot.querySelector('p');
        expect(pEl.textContent).toBe('The permission set is not assigned');
    });

    it('displays the correct UI when custom permission is false', async () => {
        mockPermission.mockReturnValueOnce({
            ...mockModule,
            default: false
        });

        const element = createElement(
            'c-misc-permission-based-u-i', {
                is: MiscPermissionBasedUI
        });

        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        const pEl = element.shadowRoot.querySelector('p');
        expect(pEl.textContent).toBe('The permission set is not assigned');
    });

    it('is accessible when custom permission is true', async () => {
        mockPermission.mockReturnValueOnce({
            ...mockModule,
            default: true
        });

        const element = createElement(
            'c-misc-permission-based-u-i', {
                is: MiscPermissionBasedUI
        });

        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });

    it('is accessible when custom permission is false', async () => {
        mockPermission.mockReturnValueOnce({
            ...mockModule,
            default: undefined
        });

        const element = createElement(
            'c-misc-permission-based-u-i', {
                is: MiscPermissionBasedUI
        });

        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });
});
