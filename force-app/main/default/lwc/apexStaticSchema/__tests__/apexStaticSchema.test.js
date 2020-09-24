import { createElement } from 'lwc';
import ApexStaticSchema from 'c/apexStaticSchema';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import getSingleContact from '@salesforce/apex/ContactController.getSingleContact';

// Realistic data with a single record
const mockGetSingleContact = require('./data/getSingleContact.json');

// Register as Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const getSingleContactAdapter = registerApexTestWireAdapter(getSingleContact);

describe('c-apex-static-schema', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    describe('getSingleContact @wire', () => {
        it('renders single record when data returned', () => {
            // Create initial element
            const element = createElement('c-apex-static-schema', {
                is: ApexStaticSchema
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getSingleContactAdapter.emit(mockGetSingleContact);

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                // Select elements for validation
                const detailEls = element.shadowRoot.querySelectorAll('p');
                expect(detailEls[0].textContent).toBe(
                    mockGetSingleContact.Name
                );
                expect(detailEls[1].textContent).toBe(
                    mockGetSingleContact.Title
                );

                const emailEl = element.shadowRoot.querySelector(
                    'lightning-formatted-email'
                );
                expect(emailEl.value).toBe(mockGetSingleContact.Email);
            });
        });

        it('shows error panel element when error returned', () => {
            // Create initial element
            const element = createElement('c-apex-static-schema', {
                is: ApexStaticSchema
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

    it('is accessible when data is returned', () => {
        // Create initial element
        const element = createElement('c-apex-static-schema', {
            is: ApexStaticSchema
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getSingleContactAdapter.emit(mockGetSingleContact);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });

    it('is accessible when error is returned', () => {
        // Create initial element
        const element = createElement('c-apex-static-schema', {
            is: ApexStaticSchema
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getSingleContactAdapter.error();

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });
});
