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

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.
    async function flushPromises() {
        return Promise.resolve();
    }

    describe('getListUi @wire data', () => {
        it('renders contacts from listView', async () => {
            // Create element
            const element = createElement('c-wire-list-view', {
                is: WireListView
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getListUiAdapter.emit(mockGetListUi);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Select elements for validation
            const contactEls = element.shadowRoot.querySelectorAll('p');
            expect(contactEls.length).toBe(mockGetListUi.records.count);
            expect(contactEls[0].textContent).toBe(
                mockGetListUi.records.records[0].fields.Name.value
            );
        });
    });

    describe('getListUi @wire error', () => {
        it('shows error panel element', async () => {
            // Create initial element
            const element = createElement('c-wire-list-view', {
                is: WireListView
            });
            document.body.appendChild(element);

            // Emit error from @wire
            getListUiAdapter.error();

            // Wait for any asynchronous DOM updates
            await flushPromises();

            const errorPanelEl =
                element.shadowRoot.querySelector('c-error-panel');
            expect(errorPanelEl).not.toBeNull();
        });
    });

    it('is accessible when list view is returned', async () => {
        // Create element
        const element = createElement('c-wire-list-view', {
            is: WireListView
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getListUiAdapter.emit(mockGetListUi);

        await expect(element).toBeAccessible();
    });

    it('is accessible when error is returned', async () => {
        // Create element
        const element = createElement('c-wire-list-view', {
            is: WireListView
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getListUiAdapter.error();

        await expect(element).toBeAccessible();
    });
});
