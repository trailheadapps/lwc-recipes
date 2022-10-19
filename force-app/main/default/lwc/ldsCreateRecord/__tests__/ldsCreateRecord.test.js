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

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling createRecord.
    async function flushPromises() {
        return Promise.resolve();
    }

    it('sets value from lightning-input field as parameter to createRecord call', async () => {
        const USER_INPUT = 'Gomez Inc.';
        const INPUT_PARAMETERS = [
            { apiName: 'Account', fields: { Name: USER_INPUT } }
        ];

        // Create initial element
        const element = createElement('c-lds-create-record', {
            is: LdsCreateRecord
        });
        document.body.appendChild(element);

        // Select input field for simulating user input
        const inputEl = element.shadowRoot.querySelector(
            'lightning-input[class="slds-var-m-bottom_x-small"]'
        );
        inputEl.value = USER_INPUT;
        inputEl.dispatchEvent(new CustomEvent('change'));

        // Select button for simulating user interaction
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Wait for any asynchronous DOM updates.
        await flushPromises();

        // Validate createRecord call
        expect(createRecord).toHaveBeenCalled();
        expect(createRecord.mock.calls[0]).toEqual(INPUT_PARAMETERS);
    });

    it('displays an account id after record creation', async () => {
        const USER_INPUT = 'Gomez Inc.';

        // Assign mock value for resolved createRecord promise
        createRecord.mockResolvedValue(mockCreateRecord);

        // Create initial element
        const element = createElement('c-lds-create-record', {
            is: LdsCreateRecord
        });
        document.body.appendChild(element);

        // Select input field for simulating user input
        const inputEl = element.shadowRoot.querySelector(
            'lightning-input[class="slds-var-m-bottom_x-small"]'
        );
        inputEl.value = USER_INPUT;
        inputEl.dispatchEvent(new CustomEvent('change'));

        // Select button for simulating user interaction
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Wait for any asynchronous DOM updates.
        await flushPromises();

        // Select element for validation
        const displayEl = element.shadowRoot.querySelector(
            'lightning-input[data-id="accountId"]'
        );
        expect(displayEl.value).toBe(mockCreateRecord.id);
    });

    it('displays a success toast after record creation', async () => {
        const USER_INPUT = 'Gomez Inc.';

        // Assign mock value for resolved createRecord promise
        createRecord.mockResolvedValue(mockCreateRecord);

        // Create initial element
        const element = createElement('c-lds-create-record', {
            is: LdsCreateRecord
        });
        document.body.appendChild(element);

        // Mock handler for toast event
        const handler = jest.fn();
        // Add event listener to catch toast event
        element.addEventListener(ShowToastEventName, handler);

        // Select input field for simulating user input
        const inputEl = element.shadowRoot.querySelector(
            'lightning-input[class="slds-var-m-bottom_x-small"]'
        );
        inputEl.value = USER_INPUT;
        inputEl.dispatchEvent(new CustomEvent('change'));

        // Select button for simulating user interaction
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Wait for any asynchronous DOM updates.
        await flushPromises();

        // Check if toast event has been fired
        expect(handler).toHaveBeenCalled();
        expect(handler.mock.calls[0][0].detail.variant).toBe('success');
    });

    it('displays an error toast on createRecord error', async () => {
        const USER_INPUT = 'invalid';

        // Assign mock value for rejected createRecord promise
        createRecord.mockRejectedValue(new Error('Account creation error'));

        // Create initial element
        const element = createElement('c-lds-create-record', {
            is: LdsCreateRecord
        });
        document.body.appendChild(element);

        // Mock handler for toast event
        const handler = jest.fn();
        // Add event listener to catch toast event
        element.addEventListener(ShowToastEventName, handler);

        // Select input field for simulating user input
        const inputEl = element.shadowRoot.querySelector(
            'lightning-input[class="slds-var-m-bottom_x-small"]'
        );
        inputEl.value = USER_INPUT;
        inputEl.dispatchEvent(new CustomEvent('change'));

        // Select button for simulating user interaction
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Wait for any asynchronous DOM updates.
        await flushPromises();

        // Check if toast event has been fired
        expect(handler).toHaveBeenCalled();
        expect(handler.mock.calls[0][0].detail.variant).toBe('error');
    });

    it('is accessible', async () => {
        const element = createElement('c-lds-create-record', {
            is: LdsCreateRecord
        });

        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });
});
