import { createElement } from 'lwc';
import NavToRecord from 'c/navToRecord';
import { getNavigateCalledWith } from 'lightning/navigation';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import getSingleContact from '@salesforce/apex/ContactController.getSingleContact';
// This test uses a mocked navigation plugin and mocked apex wire adapter.
// See force-app/test/jest-mocks/navigation.js for the navigation mock,
// the apex mock is standard with sfdx-lwc-jest,
// and see jest.config.js for jest config to use the mocks

// Mocked single contact record Id is only field required
const mockGetSingleContact = require('./data/getSingleContact.json');

// Register getSingleContact as Apex wire adapter. Tests require mocked Contact Id
const getSingleContactAdapter = registerApexTestWireAdapter(getSingleContact);

describe('c-nav-to-record', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    it('navigates to record view', () => {
        // Nav param values to test later
        const NAV_TYPE = 'standard__recordPage';
        const NAV_OBJECT_API_NAME = 'Contact';
        const NAV_ACTION_NAME = 'view';
        const NAV_RECORD_ID = '0031700000pJRRWAA4';

        // Create initial lwc element and attach to virtual DOM
        const element = createElement('c-nav-to-record', {
            is: NavToRecord
        });
        document.body.appendChild(element);

        // Simulate the data sent over wire adapter to hydrate the wired property
        getSingleContactAdapter.emit(mockGetSingleContact);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Get handle to view button and fire click event
            const buttonEl = element.shadowRoot.querySelector(
                'lightning-button.slds-var-m-right_x-small'
            );
            buttonEl.click();

            const { pageReference } = getNavigateCalledWith();

            // Verify component called with correct event type and params
            expect(pageReference.type).toBe(NAV_TYPE);
            expect(pageReference.attributes.objectApiName).toBe(
                NAV_OBJECT_API_NAME
            );
            expect(pageReference.attributes.actionName).toBe(NAV_ACTION_NAME);
            expect(pageReference.attributes.recordId).toBe(NAV_RECORD_ID);
        });
    });

    it('navigates to record edit', () => {
        // Nav param values to test later
        const NAV_TYPE = 'standard__recordPage';
        const NAV_OBJECT_API_NAME = 'Contact';
        const NAV_ACTION_NAME = 'edit';
        const NAV_RECORD_ID = '0031700000pJRRWAA4';

        // Create initial lwc element and attach to virtual DOM
        const element = createElement('c-nav-to-record', {
            is: NavToRecord
        });
        document.body.appendChild(element);

        // Simulate the data sent over wire adapter to hydrate the wired property
        getSingleContactAdapter.emit(mockGetSingleContact);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Get handle to edit button and fire click event
            const buttonEl = element.shadowRoot.querySelector(
                'lightning-button:not(.slds-var-m-right_x-small)'
            );
            // Selector for no class could also be 'lightning-button:not([class])'

            buttonEl.click();

            const { pageReference } = getNavigateCalledWith();

            // Verify component called with correct event type and params
            expect(pageReference.type).toBe(NAV_TYPE);
            expect(pageReference.attributes.objectApiName).toBe(
                NAV_OBJECT_API_NAME
            );
            expect(pageReference.attributes.actionName).toBe(NAV_ACTION_NAME);
            expect(pageReference.attributes.recordId).toBe(NAV_RECORD_ID);
        });
    });
});
