import { createElement } from 'lwc';
import WireGetPicklistValuesByRecordType from 'c/wireGetPicklistValuesByRecordType';
import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import { getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';

// Mock realistic data
const mockGetPicklistValuesByRecordType = require('./data/getPicklistValuesByRecordType.json');

// Register as an LDS wire adapter. Some tests verify the provisioned values trigger desired behavior.
const getPicklistValuesByRecordTypeAdapter = registerLdsTestWireAdapter(
    getPicklistValuesByRecordType
);

describe('c-wire-get-picklist-values-by-record-type', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.
    async function flushPromises() {
        return Promise.resolve();
    }

    describe('getPicklistValuesByRecordType @wire data', () => {
        it('renders a lightning-tree with eight entries', async () => {
            // Create element
            const element = createElement(
                'c-wire-get-picklist-values-by-record-type',
                {
                    is: WireGetPicklistValuesByRecordType
                }
            );
            document.body.appendChild(element);

            // Emit data from @wire
            getPicklistValuesByRecordTypeAdapter.emit(
                mockGetPicklistValuesByRecordType
            );

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Select elements for validation
            const treeEl = element.shadowRoot.querySelector('lightning-tree');
            expect(treeEl).not.toBeNull();
        });
    });

    describe('getPicklistValuesByRecordType @wire error', () => {
        it('shows error panel element', async () => {
            // Create initial element
            const element = createElement(
                'c-wire-get-picklist-values-by-record-type',
                {
                    is: WireGetPicklistValuesByRecordType
                }
            );
            document.body.appendChild(element);

            // Emit error from @wire
            getPicklistValuesByRecordTypeAdapter.error();

            // Wait for any asynchronous DOM updates
            await flushPromises();

            const errorPanelEl =
                element.shadowRoot.querySelector('c-error-panel');
            expect(errorPanelEl).not.toBeNull();
        });
    });

    it('is accessible when picklist values are returned', async () => {
        // Create element
        const element = createElement(
            'c-wire-get-picklist-values-by-record-type',
            {
                is: WireGetPicklistValuesByRecordType
            }
        );
        document.body.appendChild(element);

        // Emit data from @wire
        getPicklistValuesByRecordTypeAdapter.emit(
            mockGetPicklistValuesByRecordType
        );

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });

    it('is accessible when error is returned', async () => {
        // Create element
        const element = createElement(
            'c-wire-get-picklist-values-by-record-type',
            {
                is: WireGetPicklistValuesByRecordType
            }
        );
        document.body.appendChild(element);

        // Emit error from @wire
        getPicklistValuesByRecordTypeAdapter.error();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });
});
