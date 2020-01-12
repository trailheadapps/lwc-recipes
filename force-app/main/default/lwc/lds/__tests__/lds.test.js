import { createElement } from 'lwc';
import Lds from 'c/lds';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import { getNavigateCalledWith } from 'lightning/navigation';
import getSingleContact from '@salesforce/apex/ContactController.getSingleContact';

// Realistic data with a single record
const mockGetSingleContact = require('./data/getSingleContact.json');

// Register as Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const getSingleContactAdapter = registerApexTestWireAdapter(getSingleContact);

describe('c-lds', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    describe('getSingleContact @wire data', () => {
        it('render UI with record', () => {
            // Create initial element
            const element = createElement('c-lds', {
                is: Lds
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getSingleContactAdapter.emit(mockGetSingleContact);

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                // Select elements for validation
                const buttonEl = element.shadowRoot.querySelector(
                    'lightning-button'
                );
                expect(buttonEl).not.toBeNull();
            });
        });

        it('navigates to contact page when Take me there! button clicked', () => {
            const INPUT_OBJECT = 'Contact';
            const INPUT_TYPE = 'standard__recordPage';

            // Create initial element
            const element = createElement('c-lds', {
                is: Lds
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getSingleContactAdapter.emit(mockGetSingleContact);

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                // Select button to simulate user interaction
                const buttonEl = element.shadowRoot.querySelector(
                    'lightning-button'
                );
                buttonEl.click();

                const { pageReference } = getNavigateCalledWith();
                // Verify the component under test called the correct navigate event
                // type and sent the expected recordId defined above
                expect(pageReference.type).toBe(INPUT_TYPE);
                expect(pageReference.attributes.objectApiName).toBe(
                    INPUT_OBJECT
                );
                expect(pageReference.attributes.recordId).toBe(
                    mockGetSingleContact.Id
                );
            });
        });
    });

    describe('getSingleContact @wire error', () => {
        it('shows error panel element', () => {
            // Create initial element
            const element = createElement('c-lds', {
                is: Lds
            });
            document.body.appendChild(element);

            // Emit error from @wire
            getSingleContactAdapter.error();

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
