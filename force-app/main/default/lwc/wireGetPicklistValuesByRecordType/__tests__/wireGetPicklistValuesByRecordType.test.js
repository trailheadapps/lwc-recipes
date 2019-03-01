import { createElement } from 'lwc';
import WireGetPicklistValuesByRecordType from 'c/wireGetPicklistValuesByRecordType';
import { registerLdsTestWireAdapter } from '@salesforce/lwc-jest';
import { getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';

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

            getPicklistValuesByRecordTypeAdapter.emit(
                mockGetPicklistValuesByRecordType
            );

            return Promise.resolve(() => {
                const treeEl = element.shadowRoot.querySelectorAll(
                    'lightning-tree'
                );
                expect(treeEl.items.length).toBe(8);
            });
        });
    });

    describe('getPicklistValuesByRecordType @wire error', () => {
        it('shows error panel element', () => {
            const element = createElement(
                'c-wire-get-picklist-values-by-record-type',
                {
                    is: WireGetPicklistValuesByRecordType
                }
            );
            document.body.appendChild(element);
            getPicklistValuesByRecordTypeAdapter.error();
            return Promise.resolve().then(() => {
                const errorPanelEl = element.shadowRoot.querySelector(
                    'c-error-panel'
                );
                expect(errorPanelEl).not.toBeNull();
            });
        });
    });
});
