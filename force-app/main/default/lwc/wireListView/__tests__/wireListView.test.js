import { createElement } from 'lwc';
import WireListView from 'c/wireListView';
import { getListUi } from 'lightning/uiListApi';
import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';

// Mock realistic data
const mockGetListUi = require('./data/getListUi.json');

// Register as an LDS wire adapter. Some tests verify the provisioned values trigger desired behavior.
const getListUiAdapter = registerLdsTestWireAdapter(getListUi);

describe('c-wire-list-view', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    describe('getListUi @wire data', () => {
        it('renders contacts from listView', () => {
            // Create element
            const element = createElement('c-wire-list-view', {
                is: WireListView
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getListUiAdapter.emit(mockGetListUi);

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                // Select elements for validation
                const contactEls = element.shadowRoot.querySelectorAll('p');
                expect(contactEls.length).toBe(mockGetListUi.records.count);
                expect(contactEls[0].textContent).toBe(
                    mockGetListUi.records.records[0].fields.Name.value
                );
            });
        });
    });

    describe('getListUi @wire error', () => {
        it('shows error panel element', () => {
            // Create initial element
            const element = createElement('c-wire-list-view', {
                is: WireListView
            });
            document.body.appendChild(element);

            // Emit error from @wire
            getListUiAdapter.error();

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
