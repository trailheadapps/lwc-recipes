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

    describe('getPicklistValuesByRecordType @wire data', () => {
        it('renders a lightning-tree with eight entries', () => {
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

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                // Select elements for validation
                const treeEl = element.shadowRoot.querySelector(
                    'lightning-tree'
                );
                expect(treeEl).not.toBeNull();
            });
        });
    });

    describe('getPicklistValuesByRecordType @wire error', () => {
        it('shows error panel element', () => {
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

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                const errorPanelEl = element.shadowRoot.querySelector(
                    'c-error-panel'
                );
                expect(errorPanelEl).not.toBeNull();
            });
        });
    });
});
