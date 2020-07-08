import { createElement } from 'lwc';
import ldsGenerateRecordInputForCreate from 'c/ldsGenerateRecordInputForCreate';
import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import { getRecordCreateDefaults } from 'lightning/uiRecordApi';
import { generateRecordInputForCreate } from 'lightning/uiRecordApi';

// Mock realistic data
const mockGetRecordCreateDefaults = require('./data/getRecordCreateDefaults.json');
const mockGenerateRecordInputForCreate = require('./data/generateRecordInputForCreate.json');

// Register as an LDS wire adapter. Some tests verify the provisioned values trigger desired behavior.
const getRecordCreateDefaultsAdapter = registerLdsTestWireAdapter(
    getRecordCreateDefaults
);

describe('c-lds-generate-record-input-for-create', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    describe('generateRecordInputForCreate @wire data', () => {
        it('renders data correctly', () => {
            // Create element
            const element = createElement(
                'c-lds-generate-record-input-for-create',
                {
                    is: ldsGenerateRecordInputForCreate
                }
            );
            document.body.appendChild(element);

            // Mock generateRecordInputForCreate return value
            generateRecordInputForCreate.mockReturnValue(
                mockGenerateRecordInputForCreate
            );
            // Emit mock data in adapter
            getRecordCreateDefaultsAdapter.emit(mockGetRecordCreateDefaults);

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                const inputs = element.shadowRoot.querySelectorAll(
                    'lightning-input'
                );
                const errorPanel = element.shadowRoot.querySelector(
                    'c-error-panel'
                );

                expect(inputs.length).toBe(2);
                expect(inputs[1].value).toBe(
                    mockGenerateRecordInputForCreate.fields.AreaNumber__c
                );
                expect(errorPanel).toBeNull();
            });
        });
    });

    describe('getObjectInfo @wire error', () => {
        it('shows error panel element', () => {
            // Create element
            const element = createElement(
                'c-lds-generate-record-input-for-create',
                {
                    is: ldsGenerateRecordInputForCreate
                }
            );
            document.body.appendChild(element);

            // Emit error from @wire
            getRecordCreateDefaultsAdapter.error();

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                const inputs = element.shadowRoot.querySelectorAll(
                    'lightning-input'
                );
                const errorPanel = element.shadowRoot.querySelector(
                    'c-error-panel'
                );

                expect(inputs.length).toBe(0);
                expect(errorPanel).not.toBeNull();
            });
        });
    });
});
