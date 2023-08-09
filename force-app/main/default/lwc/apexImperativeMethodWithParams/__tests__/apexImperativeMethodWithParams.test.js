import { createElement } from 'lwc';
import ApexImperativeMethodWithParams from 'c/apexImperativeMethodWithParams';
import findContacts from '@salesforce/apex/ContactController.findContacts';

// Mocking imperative Apex method call
jest.mock(
    '@salesforce/apex/ContactController.findContacts',
    () => ({
        default: jest.fn()
    }),
    { virtual: true }
);

// Sample data for imperative Apex call
const APEX_CONTACTS_SUCCESS = [
    {
        Id: '0031700000pJRRSAA4',
        Name: 'Amy Taylor',
        Title: 'VP of Engineering',
        Phone: '4152568563',
        Email: 'amy@demo.net',
        Picture__c:
            'https://s3-us-west-2.amazonaws.com/dev-or-devrl-s3-bucket/sample-apps/people/amy_taylor.jpg'
    }
];

// Sample error for imperative Apex call
const APEX_CONTACTS_ERROR = {
    body: { message: 'An internal server error has occurred' },
    ok: false,
    status: 400,
    statusText: 'Bad Request'
};

describe('c-apex-imperative-method-with-params', () => {
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

    it('passes the user input to the Apex method correctly', async () => {
        const USER_INPUT = 'Taylor';
        const APEX_PARAMETERS = { searchKey: USER_INPUT };

        // Assign mock value for resolved Apex promise
        findContacts.mockResolvedValue(APEX_CONTACTS_SUCCESS);

        // Create component
        const element = createElement('c-apex-imperative-method-with-params', {
            is: ApexImperativeMethodWithParams
        });
        document.body.appendChild(element);

        // Select input field for simulating user input
        const inputEl = element.shadowRoot.querySelector('lightning-input');
        inputEl.value = USER_INPUT;
        inputEl.dispatchEvent(new CustomEvent('change'));

        // Click button
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Validate parameters of mocked Apex call
        expect(findContacts.mock.calls[0][0]).toEqual(APEX_PARAMETERS);
    });

    it('renders one contact', async () => {
        const USER_INPUT = 'Taylor';

        // Assign mock value for resolved Apex promise
        findContacts.mockResolvedValue(APEX_CONTACTS_SUCCESS);

        // Create component
        const element = createElement('c-apex-imperative-method-with-params', {
            is: ApexImperativeMethodWithParams
        });
        document.body.appendChild(element);

        // Select input field for simulating user input
        const inputEl = element.shadowRoot.querySelector('lightning-input');
        inputEl.value = USER_INPUT;
        inputEl.dispatchEvent(new CustomEvent('change'));

        // Click button
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Wait for any asynchronous DOM updates
        await flushPromises();
        await flushPromises();

        // Select div for validating conditionally changed text content
        const detailEls = element.shadowRoot.querySelectorAll('p');
        expect(detailEls.length).toBe(APEX_CONTACTS_SUCCESS.length);
        expect(detailEls[0].textContent).toBe(APEX_CONTACTS_SUCCESS[0].Name);
    });

    it('renders the error panel when the Apex method returns an error', async () => {
        // Assing mock value for rejected Apex promise
        findContacts.mockRejectedValue(APEX_CONTACTS_ERROR);

        // Create component
        const element = createElement('c-apex-imperative-method-with-params', {
            is: ApexImperativeMethodWithParams
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
        findContacts.mockResolvedValue(APEX_CONTACTS_SUCCESS);

        // Create component
        const element = createElement('c-apex-imperative-method-with-params', {
            is: ApexImperativeMethodWithParams
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
        // Assing mock value for rejected Apex promise
        findContacts.mockRejectedValue(APEX_CONTACTS_ERROR);

        // Create component
        const element = createElement('c-apex-imperative-method-with-params', {
            is: ApexImperativeMethodWithParams
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
