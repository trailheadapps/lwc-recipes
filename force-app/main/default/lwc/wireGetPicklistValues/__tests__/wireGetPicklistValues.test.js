import { createElement } from 'lwc';
import WireGetPicklistValues from 'c/wireGetPicklistValues';
import { registerLdsTestWireAdapter } from '@salesforce/lwc-jest';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

const mockGetPicklistValues = require('./data/getPicklistValues.json');

// Register as an LDS wire adapter. Some tests verify the provisioned values trigger desired behavior.
const getPicklistValuesAdapter = registerLdsTestWireAdapter(getPicklistValues);

describe('c-wire-get-picklist-values', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    describe('getPicklistValues @wire data', () => {
        it('renders seven lightning-input fields of type checkbox', () => {
            // Create element
            const element = createElement('c-wire-get-picklist-values', {
                is: WireGetPicklistValues
            });
            document.body.appendChild(element);

            getPicklistValuesAdapter.emit(mockGetPicklistValues);

            return Promise.resolve(() => {
                const checkboxEls = element.shadowRoot.querySelectorAll(
                    'lightning-input'
                );
                expect(checkboxEls.length).toBe(mockGetPicklistValues.length);

                checkboxEls.array.forEach(checkboxEl => {
                    expect(checkboxEl.type).toBe('checkbox');
                });
            });
        });
    });

    describe('getObjectInfo @wire error', () => {
        it('shows error panel element', () => {
            const element = createElement('c-wire-get-picklist-values', {
                is: WireGetPicklistValues
            });
            document.body.appendChild(element);
            getPicklistValuesAdapter.error();
            return Promise.resolve().then(() => {
                const errorPanelEl = element.shadowRoot.querySelector(
                    'c-error-panel'
                );
                expect(errorPanelEl).not.toBeNull();
            });
        });
    });
});
