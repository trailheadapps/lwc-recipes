import { createElement } from 'lwc';
import NavToRelatedList from 'c/navToRelatedList';
import { getNavigateCalledWith } from 'lightning/navigation';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import getSingleAccount from '@salesforce/apex/AccountController.getSingleAccount';

// mocked single contact record Id is only field required
const mockGetSingleAccount = require('./data/getSingleAccount.json');

// Register getSingleContact as Apex wire adapter. Tests require mocked Contact Id
const getSingleAccountAdapter = registerApexTestWireAdapter(getSingleAccount);

describe('c-nav-to-related-list', () => {
    it('navigates to related list', () => {
        const NAV_TYPE = 'standard__recordRelationshipPage';
        const NAV_OBJECT_API_NAME = 'Account';
        const NAV_RELATIONSHIP_API_NAME = 'Contacts';
        const NAV_ACTION_NAME = 'view';
        const NAV_RECORD_ID = '0013O00000Asx5LQAR';

        const element = createElement('c-nav-to-related-list', {
            is: NavToRelatedList
        });
        document.body.appendChild(element);

        getSingleAccountAdapter.emit(mockGetSingleAccount);

        return Promise.resolve().then(() => {
            const buttonEl = element.shadowRoot.querySelector(
                'lightning-button'
            );
            // selector for no class could be 'lightning-button:not(.slds-m-right_x-small)' or 'lightning-button:not([class])'

            buttonEl.click();

            const { pageReference } = getNavigateCalledWith();

            // verify component called with correct event type
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
