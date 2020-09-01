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
});
