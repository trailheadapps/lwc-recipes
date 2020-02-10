import { createElement } from 'lwc';
import NavToRecord from 'c/navToRecord';
import { getNavigateCalledWith } from 'lightning/navigation';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import getSingleContact from '@salesforce/apex/ContactController.getSingleContact';

// mocked single contact record Id is only field required
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
        const NAV_TYPE = 'standard__recordPage';
        const NAV_OBJECT_API_NAME = 'Contact';
        const NAV_ACTION_NAME = 'view';
        const NAV_RECORD_ID = '0031700000pJRRWAA4';

        const element = createElement('c-nav-to-record', {
            is: NavToRecord
        });
        document.body.appendChild(element);

        getSingleContactAdapter.emit(mockGetSingleContact);

        return Promise.resolve().then(() => {
            const buttonEl = element.shadowRoot.querySelector(
                'lightning-button.slds-m-right_x-small'
            );
            // selector for no class could be 'lightning-button:not(.slds-m-right_x-small)' or 'lightning-button:not([class])'

            buttonEl.click();

            const { pageReference } = getNavigateCalledWith();

            // verify component called with correct event type
            expect(pageReference.type).toBe(NAV_TYPE);
            expect(pageReference.attributes.objectApiName).toBe(
                NAV_OBJECT_API_NAME
            );
            expect(pageReference.attributes.actionName).toBe(NAV_ACTION_NAME);
            expect(pageReference.attributes.recordId).toBe(NAV_RECORD_ID);
        });
    });

    it('navigates to record edit', () => {
        const NAV_TYPE = 'standard__recordPage';
        const NAV_OBJECT_API_NAME = 'Contact';
        const NAV_ACTION_NAME = 'edit';
        const NAV_RECORD_ID = '0031700000pJRRWAA4';

        const element = createElement('c-nav-to-record', {
            is: NavToRecord
        });
        document.body.appendChild(element);

        getSingleContactAdapter.emit(mockGetSingleContact);

        return Promise.resolve().then(() => {
            const buttonEl = element.shadowRoot.querySelector(
                'lightning-button:not(.slds-m-right_x-small)'
            );
            // selector for no class could be 'lightning-button:not(.slds-m-right_x-small)' or 'lightning-button:not([class])'

            buttonEl.click();

            const { pageReference } = getNavigateCalledWith();

            // verify component called with correct event type
            expect(pageReference.type).toBe(NAV_TYPE);
            expect(pageReference.attributes.objectApiName).toBe(
                NAV_OBJECT_API_NAME
            );
            expect(pageReference.attributes.actionName).toBe(NAV_ACTION_NAME);
            expect(pageReference.attributes.recordId).toBe(NAV_RECORD_ID);
        });
    });
});
