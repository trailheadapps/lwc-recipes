import { createElement } from 'lwc';
import ApexWireMethodToFunction from 'c/apexWireMethodToFunction';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import getContactList from '@salesforce/apex/ContactController.getContactList';

// Realistic data with a list of contacts
const mockGetContactList = require('./data/getContactList.json');

// Register as Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const getContactListAdapter = registerApexTestWireAdapter(getContactList);

describe('c-apex-wire-method-to-function', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.
    async function flushPromises() {
        return Promise.resolve();
    }

    describe('getContactList @wire', () => {
        it('renders six records when data returned', async () => {
            // Create initial element
            const element = createElement('c-apex-wire-method-to-function', {
                is: ApexWireMethodToFunction
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getContactListAdapter.emit(mockGetContactList);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Select elements for validation
            const detailEls = element.shadowRoot.querySelectorAll('p');
            expect(detailEls.length).toBe(mockGetContactList.length);
            expect(detailEls[0].textContent).toBe(mockGetContactList[0].Name);
        });
        it('shows error panel element when error returned', async () => {
            // Create initial element
            const element = createElement('c-apex-wire-method-to-function', {
                is: ApexWireMethodToFunction
            });
            document.body.appendChild(element);

            // Emit error from @wire
            getContactListAdapter.error();

            // Wait for any asynchronous DOM updates
            await flushPromises();

            const errorPanelEl =
                element.shadowRoot.querySelector('c-error-panel');
            expect(errorPanelEl).not.toBeNull();
        });
    });

    it('is accessible when data is returned', async () => {
        // Create initial element
        const element = createElement('c-apex-wire-method-to-function', {
            is: ApexWireMethodToFunction
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getContactListAdapter.emit(mockGetContactList);

        await expect(element).toBeAccessible();
    });

    it('is accessible when error is returned', async () => {
        // Create initial element
        const element = createElement('c-apex-wire-method-to-function', {
            is: ApexWireMethodToFunction
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getContactListAdapter.error();

        await expect(element).toBeAccessible();
    });
});
