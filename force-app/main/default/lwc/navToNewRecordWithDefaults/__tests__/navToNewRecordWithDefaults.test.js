/* eslint-disable no-unused-vars */
import { createElement } from 'lwc';
import NavToNewRecord from 'c/navToNewRecord';
import { getNavigateCalledWith } from 'lightning/navigation';
//import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';
// This test uses a mocked navigation plugin.
// See force-app/test/jest-mocks/navigation.js for the mock
// and see jest.config.js for jest config to use the mock

describe('c-nav-to-new-record', () => {
    it('navigates to new record with default values', () => {
        // Currently creating a component importing from the lightning/pageReferenceUtils library
        // causes tests to automatically fail. Code that should work to test in the future has been
        // included below and commented out. For now this always true test acts as a placeholder
        // until the test below can be implemented.

        // See issue #127 in the sfdx-lwc-jest project
        // https://github.com/salesforce/sfdx-lwc-jest/issues/127

        // TODO once working:
        // - Remove eslint-disable no-unused-vars rule above
        // - Uncomment below test
        // - Run tests and correct, as this obviously never was run successfully!

        const alwaysPass = true;
        expect(alwaysPass).toBe(true);

        /*
        // Nav param values to test later
        const NAV_TYPE = 'standard__objectPage';
        const NAV_OBJECT_API_NAME = 'Contact';
        const NAV_ACTION_NAME = 'new';

        const NAV_DEFAULT_VALUES = {
            "FirstName": "Morag",
            "LastName": "de Fault",
            "LeadSource": "Other"
        };

        const NAV_ENCODED_DEFAULTS = encodeDefaultFieldValues(NAV_DEFAULT_VALUES);

        // Create initial lwc element and attach to virtual DOM
        const element = createElement('c-nav-to-new-record-with-defaults', {
            is: NavToNewRecordWithDefaults
        });
        document.body.appendChild(element);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Get handle to button and invoke click
            const buttonEl = element.shadowRoot.querySelector(
                'lightning-button'
            );
            buttonEl.click();

            const { pageReference } = getNavigateCalledWith();

            // Verify component called with correct event type ane params
            expect(pageReference.type).toBe(NAV_TYPE);
            expect(pageReference.attributes.objectApiName).toBe(
                NAV_OBJECT_API_NAME
            );
            expect(pageReference.attributes.actionName).toBe(NAV_ACTION_NAME);
            expect(pageReference.state.defaultValues).toBe(NAV_ENCODED_DEFAULTS);
        });
        */
    });
});
