import { createElement } from 'lwc';
import ApexImperativeMethod from 'c/apexImperativeMethod';
import getContactList from '@salesforce/apex/ContactController.getContactList';

// Mocking imperative Apex method call
jest.mock(
    '@salesforce/apex/ContactController.getContactList',
    () => ({
        default: jest.fn()
    }),
    { virtual: true }
);

// Sample data for imperative Apex call
const APEX_CONTACTS_SUCCESS = [
    {
        Id: '0031700000pJRRSAA4',
        Name: 'Amy Taylor'
    },
    {
        Id: '0031700000pJRRTAA4',
        Name: 'Michael Jones'
    }
];

// Sample error for imperative Apex call
const APEX_CONTACTS_ERROR = {
    body: { message: 'An internal server error has occurred' },
    ok: false,
    status: 400,
    statusText: 'Bad Request'
};

describe('c-apex-imperative-method', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.
    async function flushPromises() {
        return Promise.resolve();
    }

    it('renders two contacts returned from imperative Apex call', async () => {
        // Assign mock value for resolved Apex promise
        getContactList.mockResolvedValue(APEX_CONTACTS_SUCCESS);

        // Create component
        const element = createElement('c-apex-imperative-method', {
            is: ApexImperativeMethod
        });
        document.body.appendChild(element);

        // Click button
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Wait for any asynchronous DOM updates
        await flushPromises();
        await flushPromises();

        // Verify displayed text
        const detailEls = element.shadowRoot.querySelectorAll('p:not([class])');
        expect(detailEls.length).toBe(APEX_CONTACTS_SUCCESS.length);
        expect(detailEls[0].textContent).toBe(APEX_CONTACTS_SUCCESS[0].Name);
        expect(detailEls[1].textContent).toBe(APEX_CONTACTS_SUCCESS[1].Name);
    });

    it('renders the error panel when the Apex method returns an error', async () => {
        // Assign mock value for rejected Apex promise
        getContactList.mockRejectedValue(APEX_CONTACTS_ERROR);

        // Create component
        const element = createElement('c-apex-imperative-method', {
            is: ApexImperativeMethod
        });
        document.body.appendChild(element);

        // Click button
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Wait for any asynchronous DOM updates
        await flushPromises();
        await flushPromises();

        // Check for error panel
        const errorPanelEl = element.shadowRoot.querySelector('c-error-panel');
        expect(errorPanelEl).not.toBeNull();
    });

    it('is accessible when data is returned', async () => {
        // Assign mock value for resolved Apex promise
        getContactList.mockResolvedValue(APEX_CONTACTS_SUCCESS);

        // Create component
        const element = createElement('c-apex-imperative-method', {
            is: ApexImperativeMethod
        });
        document.body.appendChild(element);

        // Click button
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });

    it('is accessible when error is returned', async () => {
        // Assign mock value for rejected Apex promise
        getContactList.mockRejectedValue(APEX_CONTACTS_ERROR);

        // Create component
        const element = createElement('c-apex-imperative-method', {
            is: ApexImperativeMethod
        });
        document.body.appendChild(element);

        // Click button
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
