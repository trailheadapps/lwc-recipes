import { createElement } from 'lwc';
import WireListView from 'c/wireListView';
import { getListUi } from 'lightning/uiListApi';
import { registerLdsTestWireAdapter } from '@salesforce/lwc-jest';

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

            getListUiAdapter.emit(mockGetListUi);

            return Promise.resolve().then(() => {
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
            const element = createElement('c-wire-list-view', {
                is: WireListView
            });
            document.body.appendChild(element);
            getListUiAdapter.error();
            return Promise.resolve().then(() => {
                const errorPanelEl = element.shadowRoot.querySelector(
                    'c-error-panel'
                );
                expect(errorPanelEl).not.toBeNull();
            });
        });
    });
});
