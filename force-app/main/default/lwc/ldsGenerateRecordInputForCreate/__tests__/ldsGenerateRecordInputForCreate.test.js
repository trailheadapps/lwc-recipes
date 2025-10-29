import { createElement } from '@lwc/engine-dom';
import LdsGenerateRecordInputForCreate from 'c/ldsGenerateRecordInputForCreate';
import {
    getRecordCreateDefaults,
    generateRecordInputForCreate,
    createRecord
} from 'lightning/uiRecordApi';
import { ShowToastEventName } from 'lightning/platformShowToastEvent';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import AREANUMBER_FIELD from '@salesforce/schema/Account.AreaNumber__c';

// Mock realistic data
const mockGetRecordCreateDefaults = require('./data/getRecordCreateDefaults.json');
const mockGenerateRecordInputForCreate = require('./data/generateRecordInputForCreate.json');
const mockCreateRecord = require('./data/createRecord.json');

describe('c-lds-generate-record-input-for-create', () => {
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

    // Helper function to generate mock record input so that the form is rendered
    function generateMockRecordInput() {
        // Mock generateRecordInputForCreate return value
        generateRecordInputForCreate.mockReturnValue(
            mockGenerateRecordInputForCreate
        );

        // Emit mock data from @wire
        getRecordCreateDefaults.emit(mockGetRecordCreateDefaults);
    }

    // Helper function to simulate user input on a field
    function simulateUserInput(element, fieldName, value) {
        // Select input field for simulating user input
        const inputEl = element.shadowRoot.querySelector(
            `lightning-input[data-field-name="${fieldName}"]`
        );
        inputEl.value = value;
        inputEl.dispatchEvent(new CustomEvent('change'));
    }

    describe('getRecordCreateDefaults @wire data', () => {
        it('renders data correctly when field is visible with default value', async () => {
            // Create component
            const element = createElement(
                'c-lds-generate-record-input-for-create',
                {
                    is: LdsGenerateRecordInputForCreate
                }
            );
            document.body.appendChild(element);

            generateMockRecordInput();

            // Wait for any asynchronous DOM updates
            await flushPromises();

            const inputEls =
                element.shadowRoot.querySelectorAll('lightning-input');
            const errorPanel =
                element.shadowRoot.querySelector('c-error-panel');

            expect(inputEls.length).toBe(2);
            expect(inputEls[1].value).toBe(
                mockGenerateRecordInputForCreate.fields.AreaNumber__c
            );
            expect(errorPanel).toBeNull();
        });

        it('renders data correctly when field is not visible', async () => {
            // Create component
            const element = createElement(
                'c-lds-generate-record-input-for-create',
                {
                    is: LdsGenerateRecordInputForCreate
                }
            );
            document.body.appendChild(element);

            delete mockGenerateRecordInputForCreate.AreaNumber__c;
            generateMockRecordInput();

            // Wait for any asynchronous DOM updates
            await flushPromises();

            const inputEls =
                element.shadowRoot.querySelectorAll('lightning-input');
            const errorPanel =
                element.shadowRoot.querySelector('c-error-panel');

            expect(inputEls.length).toBe(2);
            expect(inputEls[1].value).toBe(
                mockGenerateRecordInputForCreate.fields.AreaNumber__c
            );
            expect(errorPanel).toBeNull();
        });
    });

    describe('getRecordCreateDefaults @wire error', () => {
        it('shows error panel element', async () => {
            // Create component
            const element = createElement(
                'c-lds-generate-record-input-for-create',
                {
                    is: LdsGenerateRecordInputForCreate
                }
            );
            document.body.appendChild(element);

            // Emit error from @wire
            getRecordCreateDefaults.error();

            // Wait for any asynchronous DOM updates
            await flushPromises();

            const inputEls =
                element.shadowRoot.querySelectorAll('lightning-input');
            const errorPanel =
                element.shadowRoot.querySelector('c-error-panel');

            expect(inputEls.length).toBe(0);
            expect(errorPanel).not.toBeNull();
        });
    });

    describe('createAccount', () => {
        it('populates recordInput correctly when inputs change', async () => {
            // Assign mock value for resolved createRecord promise
            createRecord.mockResolvedValue(mockCreateRecord);

            // Create component
            const element = createElement(
                'c-lds-generate-record-input-for-create',
                {
                    is: LdsGenerateRecordInputForCreate
                }
            );
            document.body.appendChild(element);

            generateMockRecordInput();

            // Wait for any asynchronous DOM updates
            await flushPromises();

            const USER_INPUT_NAME = 'Gomez Inc.';
            const USER_INPUT_AREANUMBER = 2000;

            simulateUserInput(
                element,
                NAME_FIELD.fieldApiName,
                USER_INPUT_NAME
            );
            simulateUserInput(
                element,
                AREANUMBER_FIELD.fieldApiName,
                USER_INPUT_AREANUMBER
            );

            // Click button
            const buttonEl =
                element.shadowRoot.querySelector('lightning-button');
            buttonEl.click();

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Validate parameters of mocked LDS call
            expect(createRecord.mock.calls.length).toBe(1);

            const expectedRecordInput = {
                ...mockGenerateRecordInputForCreate
            };
            expectedRecordInput.fields.Name = USER_INPUT_NAME;
            expectedRecordInput.fields.AreaNumber__c = USER_INPUT_AREANUMBER;
            expect(createRecord.mock.calls[0][0]).toEqual(expectedRecordInput);
        });

        it('displays a success toast after record creation', async () => {
            // Assign mock value for resolved createRecord promise
            createRecord.mockResolvedValue(mockCreateRecord);

            // Create component
            const element = createElement(
                'c-lds-generate-record-input-for-create',
                {
                    is: LdsGenerateRecordInputForCreate
                }
            );
            document.body.appendChild(element);

            generateMockRecordInput();

            // Mock handler for toast event and add listener
            const handler = jest.fn();
            element.addEventListener(ShowToastEventName, handler);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            simulateUserInput(element, NAME_FIELD.fieldApiName, 'Gomez Inc.');

            // Click button
            const buttonEl =
                element.shadowRoot.querySelector('lightning-button');
            buttonEl.click();

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Check if toast event has been fired
            expect(handler).toHaveBeenCalled();
            expect(handler.mock.calls[0][0].detail.variant).toBe('success');
        });

        it('displays an error toast on createRecord error', async () => {
            // Assign mock value for rejected createRecord promise
            createRecord.mockRejectedValue(new Error('Account creation error'));

            // Create component
            const element = createElement(
                'c-lds-generate-record-input-for-create',
                {
                    is: LdsGenerateRecordInputForCreate
                }
            );
            document.body.appendChild(element);

            generateMockRecordInput();

            // Mock handler for toast event and add listener
            const handler = jest.fn();
            element.addEventListener(ShowToastEventName, handler);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            simulateUserInput(element, NAME_FIELD.fieldApiName, 'invalid');

            // Click button
            const buttonEl =
                element.shadowRoot.querySelector('lightning-button');
            buttonEl.click();

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Check if toast event has been fired
            expect(handler).toHaveBeenCalled();
            expect(handler.mock.calls[0][0].detail.variant).toBe('error');
        });
    });

    it('is accessible when data is returned', async () => {
        // Create component
        const element = createElement(
            'c-lds-generate-record-input-for-create',
            {
                is: LdsGenerateRecordInputForCreate
            }
        );
        document.body.appendChild(element);

        generateMockRecordInput();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });

    it('is accessible when error is returned', async () => {
        // Create component
        const element = createElement(
            'c-lds-generate-record-input-for-create',
            {
                is: LdsGenerateRecordInputForCreate
            }
        );
        document.body.appendChild(element);

        // Emit error from @wire
        getRecordCreateDefaults.error();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
