import { createElement } from 'lwc';
import NavToRelatedList from 'c/navToRelatedList';
import { getNavigateCalledWith } from 'lightning/navigation';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import getSingleAccount from '@salesforce/apex/AccountController.getSingleAccount';
// This test uses a mocked navigation plugin and mocked apex wire adapter.
// See force-app/test/jest-mocks/navigation.js for the navigation mock,
// the apex mock is standard with sfdx-lwc-jest,
// and see jest.config.js for jest config to use the mocks

// Mocked single account record Id is only field required
const mockGetSingleAccount = require('./data/getSingleAccount.json');

// Register getSingleAccount as Apex wire adapter. Tests require mocked Account Id
const getSingleAccountAdapter = registerApexTestWireAdapter(getSingleAccount);

describe('c-nav-to-related-list', () => {
    it('navigates to related list', () => {
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

        // Simulate the data sent over wire adapter to hydrate the wired property
        getSingleAccountAdapter.emit(mockGetSingleAccount);

        return Promise.resolve().then(() => {
            // Get handle to button and fire click event
            const buttonEl = element.shadowRoot.querySelector(
                'lightning-button'
            );

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
    });

    it('shows error panel when there is an error', () => {
        // Create initial lwc element and attach to virtual DOM
        const element = createElement('c-nav-to-related-list', {
            is: NavToRelatedList
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getSingleAccountAdapter.error();

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

    it('is accessible when data is returned', () => {
        // Create initial lwc element and attach to virtual DOM
        const element = createElement('c-nav-to-related-list', {
            is: NavToRelatedList
        });
        document.body.appendChild(element);

        // Simulate the data sent over wire adapter to hydrate the wired property
        getSingleAccountAdapter.emit(mockGetSingleAccount);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });

    it('is accessible when error is returned', () => {
        // Create initial lwc element and attach to virtual DOM
        const element = createElement('c-nav-to-related-list', {
            is: NavToRelatedList
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getSingleAccountAdapter.error();

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });
});
