import { createElement } from 'lwc';
import ApexImperativeMethod from 'c/apexImperativeMethod';
import getContactList from '@salesforce/apex/ContactController.getContactList';

// Mocking imperative Apex method call
jest.mock(
    '@salesforce/apex/ContactController.getContactList',
    () => {
        return {
            default: jest.fn()
        };
    },
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
            'https://s3-us-west-1.amazonaws.com/sfdc-demo/people/amy_taylor.jpg'
    },
    {
        Id: '0031700000pJRRTAA4',
        Name: 'Michael Jones',
        Title: 'VP of Sales',
        Phone: '4158526633',
        Email: 'michael@demo.net',
        Picture__c:
            'https://s3-us-west-1.amazonaws.com/sfdc-demo/people/michael_jones.jpg'
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
    function flushPromises() {
        // eslint-disable-next-line no-undef
        return new Promise((resolve) => setImmediate(resolve));
    }

    it('renders two contacts returned from imperative Apex call', () => {
        // Assign mock value for resolved Apex promise
        getContactList.mockResolvedValue(APEX_CONTACTS_SUCCESS);

        // Create initial element
        const element = createElement('c-apex-imperative-method', {
            is: ApexImperativeMethod
        });
        document.body.appendChild(element);

        // Select button for executing Apex call
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Return an immediate flushed promise (after the Apex call) to then
        // wait for any asynchronous DOM updates. Jest will automatically wait
        // for the Promise chain to complete before ending the test and fail
        // the test if the promise ends in the rejected state.
        return flushPromises().then(() => {
            // Select div for validating conditionally changed text content
            const detailEls = element.shadowRoot.querySelectorAll(
                'p:not([class])'
            );
            expect(detailEls.length).toBe(APEX_CONTACTS_SUCCESS.length);
            expect(detailEls[0].textContent).toBe(
                APEX_CONTACTS_SUCCESS[0].Name
            );
            expect(detailEls[1].textContent).toBe(
                APEX_CONTACTS_SUCCESS[1].Name
            );
        });
    });

    it('renders the error panel when the Apex method returns an error', () => {
        // Assign mock value for rejected Apex promise
        getContactList.mockRejectedValue(APEX_CONTACTS_ERROR);

        // Create initial element
        const element = createElement('c-apex-imperative-method', {
            is: ApexImperativeMethod
        });
        document.body.appendChild(element);

        // Select button for executing Apex call
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Return an immediate flushed promise (after the Apex call) to then
        // wait for any asynchronous DOM updates. Jest will automatically wait
        // for the Promise chain to complete before ending the test and fail
        // the test if the promise ends in the rejected state.
        return flushPromises().then(() => {
            const errorPanelEl = element.shadowRoot.querySelector(
                'c-error-panel'
            );
            expect(errorPanelEl).not.toBeNull();
        });
    });
});
