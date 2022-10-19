import { createElement } from 'lwc';
import NavToRelatedList from 'c/navToRelatedList';
import { getNavigateCalledWith } from 'lightning/navigation';
import getSingleAccount from '@salesforce/apex/AccountController.getSingleAccount';
// This test uses a mocked navigation plugin and mocked apex wire.
// See force-app/test/jest-mocks/navigation.js for the navigation mock,
// the apex mock is standard with sfdx-lwc-jest,
// and see jest.config.js for jest config to use the mocks

// Mocked single account record Id is only field required
const mockGetSingleAccount = require('./data/getSingleAccount.json');

// Mock Apex wire adapter
jest.mock(
    '@salesforce/apex/AccountController.getSingleAccount',
    () => {
        const {
            createApexTestWireAdapter
        } = require('@salesforce/sfdx-lwc-jest');
        return {
            default: createApexTestWireAdapter(jest.fn())
        };
    },
    { virtual: true }
);

describe('c-nav-to-related-list', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Reset the navigation mock between tests
        jest.clearAllMocks();
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.
    async function flushPromises() {
        return Promise.resolve();
    }

    it('navigates to related list', async () => {
        // Nav param values to test later
        const NAV_TYPE = 'standard__recordRelationshipPage';
        const NAV_OBJECT_API_NAME = 'Account';
        const NAV_RELATIONSHIP_API_NAME = 'Contacts';
        const NAV_ACTION_NAME = 'view';
        const NAV_RECORD_ID = '0013O00000Asx5LQAR';

        // Create initial lwc element and attach to virtual DOM
        const element = createElement('c-nav-to-related-list', {
            is: NavToRelatedList
        });
        document.body.appendChild(element);

        // Simulate the data sent over wire to hydrate the wired property
        getSingleAccount.emit(mockGetSingleAccount);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Get handle to button and fire click event
        const buttonEl = element.shadowRoot.querySelector('lightning-button');

        buttonEl.click();

        const { pageReference } = getNavigateCalledWith();

        // Verify component called with correct event type and params
        expect(pageReference.type).toBe(NAV_TYPE);
        expect(pageReference.attributes.objectApiName).toBe(
            NAV_OBJECT_API_NAME
        );
        expect(pageReference.attributes.relationshipApiName).toBe(
            NAV_RELATIONSHIP_API_NAME
        );
        expect(pageReference.attributes.actionName).toBe(NAV_ACTION_NAME);
        expect(pageReference.attributes.recordId).toBe(NAV_RECORD_ID);
    });

    it('shows error panel when there is an error', async () => {
        // Create initial lwc element and attach to virtual DOM
        const element = createElement('c-nav-to-related-list', {
            is: NavToRelatedList
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getSingleAccount.error();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        const errorPanelEl = element.shadowRoot.querySelector('c-error-panel');
        expect(errorPanelEl).not.toBeNull();
    });

    it('is accessible when data is returned', async () => {
        // Create initial lwc element and attach to virtual DOM
        const element = createElement('c-nav-to-related-list', {
            is: NavToRelatedList
        });
        document.body.appendChild(element);

        // Simulate the data sent over wire to hydrate the wired property
        getSingleAccount.emit(mockGetSingleAccount);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });

    it('is accessible when error is returned', async () => {
        // Create initial lwc element and attach to virtual DOM
        const element = createElement('c-nav-to-related-list', {
            is: NavToRelatedList
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getSingleAccount.error();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });
});
