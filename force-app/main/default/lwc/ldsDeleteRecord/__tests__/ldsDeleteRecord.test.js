import { createElement } from 'lwc';
import LdsDeleteRecord from 'c/ldsDeleteRecord';
import { deleteRecord } from 'lightning/uiRecordApi';
import { registerApexTestWireAdapter } from '@salesforce/lwc-jest';
import getAccountList from '@salesforce/apex/AccountController.getAccountList';

// Realistic data with a list of contacts
const mockGetAccountList = require('./data/getAccountList.json');
// An empty list of records to verify the component does something reasonable
// when there is no data to display
const mockGetAccountListNoRecords = require('./data/getAccountListNoRecords.json');

// Register as an Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const getAccountListAdapter = registerApexTestWireAdapter(getAccountList);

describe('c-lds-delete-record', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    describe('getAccountList @wire data', () => {
        it('renders seven records with name and lightning-button-icon', () => {
            const ACCOUNT_NAME_RESULT = 'GenePoint';
            const ACCOUNT_ID_RESULT = '0011700000r5uciAAA';
            const ACCOUNT_COUNT = 7;

            const element = createElement('c-lds-delete-record', {
                is: LdsDeleteRecord
            });
            document.body.appendChild(element);
            getAccountListAdapter.emit(mockGetAccountList);
            return Promise.resolve().then(() => {
                const nameEl = element.shadowRoot.querySelector(
                    'lightning-layout-item'
                );
                expect(nameEl.textContent).toBe(ACCOUNT_NAME_RESULT);

                const buttonEls = element.shadowRoot.querySelectorAll(
                    'lightning-button-icon'
                );
                expect(buttonEls.length).toBe(ACCOUNT_COUNT);
                expect(buttonEls[0].dataset.recordid).toBe(ACCOUNT_ID_RESULT);
            });
        });

        it('renders no buttons when no record exists', () => {
            const element = createElement('c-lds-delete-record', {
                is: LdsDeleteRecord
            });
            document.body.appendChild(element);
            getAccountListAdapter.emit(mockGetAccountListNoRecords);
            return Promise.resolve().then(() => {
                const nameEl = element.shadowRoot.querySelector(
                    'lightning-button-icon'
                );
                expect(nameEl).toBeNull();

                const detailEls = element.shadowRoot.querySelectorAll(
                    'lightning-button-icon'
                );
                expect(detailEls.length).toBe(0);
            });
        });
    });

    describe('getAccountList @wire error', () => {
        it('shows error panel element', () => {
            const element = createElement('c-apex-wire-method-to-function', {
                is: LdsDeleteRecord
            });
            document.body.appendChild(element);
            getAccountListAdapter.error();
            return Promise.resolve().then(() => {
                const errorPanelEl = element.shadowRoot.querySelector(
                    'c-error-panel'
                );
                expect(errorPanelEl).not.toBeNull();
            });
        });
    });

    it('deletes the first entry of the account list on button click', () => {
        const INPUT_PARAMETER = ['0011700000r5uciAAA'];

        const element = createElement('c-lds-delete-record', {
            is: LdsDeleteRecord
        });
        document.body.appendChild(element);

        getAccountListAdapter.emit(mockGetAccountList);

        // Return a promise to wait for any asynchronous DOM updates.
        return Promise.resolve()
            .then(() => {
                const buttonEl = element.shadowRoot.querySelector(
                    'lightning-button-icon'
                );
                buttonEl.click();
            })
            .then(() => {
                expect(deleteRecord).toHaveBeenCalled();
                expect(deleteRecord.mock.calls[0]).toEqual(INPUT_PARAMETER);
            });
    });
});
