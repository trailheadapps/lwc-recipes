import { createElement } from 'lwc';
import LdsCreateRecord from 'c/ldsCreateRecord';
import { ShowToastEventName } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';

// Realistic data after a create record call
const mockCreateRecord = require('./data/createRecord.json');

describe('c-lds-create-record', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise timing when calling UI API
    function flushPromises() {
        // eslint-disable-next-line no-undef
        return new Promise(resolve => setImmediate(resolve));
    }

    it('sets value from lightning-input field as parameter to createRecord call', () => {
        const USER_INPUT = 'Gomez Inc.';
        const INPUT_PARAMETERS = [
            { apiName: 'Account', fields: { Name: USER_INPUT } }
        ];

        const element = createElement('c-lds-create-record', {
            is: LdsCreateRecord
        });
        document.body.appendChild(element);

        const inputEl = element.shadowRoot.querySelector(
            'lightning-input[class="slds-m-bottom_x-small"]'
        );
        inputEl.value = USER_INPUT;
        inputEl.dispatchEvent(new CustomEvent('change'));

        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Return a promise to wait for any asynchronous DOM updates.
        return Promise.resolve().then(() => {
            expect(createRecord).toHaveBeenCalled();
            expect(createRecord.mock.calls[0]).toEqual(INPUT_PARAMETERS);
        });
    });

    it('displays an account id after record creation', () => {
        const USER_INPUT = 'Gomez Inc.';
        const RESULT = '0011700000r6zdbAAA';
        createRecord.mockResolvedValue(mockCreateRecord);

        const element = createElement('c-lds-create-record', {
            is: LdsCreateRecord
        });
        document.body.appendChild(element);

        const inputEl = element.shadowRoot.querySelector(
            'lightning-input[class="slds-m-bottom_x-small"]'
        );
        inputEl.value = USER_INPUT;
        inputEl.dispatchEvent(new CustomEvent('change'));

        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Return a promise to wait for any asynchronous DOM updates.
        return flushPromises().then(() => {
            const displayEl = element.shadowRoot.querySelector(
                'lightning-input[data-id="accountId"]'
            );
            expect(displayEl.value).toBe(RESULT);
        });
    });

    it('displays a success toast after record creation', () => {
        const USER_INPUT = 'Gomez Inc.';
        createRecord.mockResolvedValue(mockCreateRecord);

        const element = createElement('c-lds-create-record', {
            is: LdsCreateRecord
        });
        document.body.appendChild(element);

        // Mock handler for toast event
        const handler = jest.fn();
        // Add event listener to catch toast event
        element.addEventListener(ShowToastEventName, handler);

        const inputEl = element.shadowRoot.querySelector(
            'lightning-input[class="slds-m-bottom_x-small"]'
        );
        inputEl.value = USER_INPUT;
        inputEl.dispatchEvent(new CustomEvent('change'));

        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Return a promise to wait for any asynchronous DOM updates.
        return Promise.resolve().then(() => {
            // Check if toast event has been fired
            expect(handler).toHaveBeenCalled();
            expect(handler.mock.calls[0][0].detail.variant).toBe('success');
        });
    });

    it('displays an error toast on createRecord error', () => {
        const USER_INPUT = 'invalid';
        createRecord.mockRejectedValue = { id: '111' };

        const element = createElement('c-lds-create-record', {
            is: LdsCreateRecord
        });
        document.body.appendChild(element);

        // Mock handler for toast event
        const handler = jest.fn();
        // Add event listener to catch toast event
        element.addEventListener(ShowToastEventName, handler);

        const inputEl = element.shadowRoot.querySelector(
            'lightning-input[class="slds-m-bottom_x-small"]'
        );
        inputEl.value = USER_INPUT;
        inputEl.dispatchEvent(new CustomEvent('change'));

        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Return a promise to wait for any asynchronous DOM updates.
        return Promise.resolve().then(() => {
            // Check if toast event has been fired
            expect(handler).toHaveBeenCalled();
            expect(handler.mock.calls[0][0].detail.variant).toBe('success');
        });
    });
});
