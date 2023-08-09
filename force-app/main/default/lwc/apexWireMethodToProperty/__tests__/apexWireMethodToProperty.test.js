import { createElement } from 'lwc';
import ApexWireMethodToProperty from 'c/apexWireMethodToProperty';
import getContactList from '@salesforce/apex/ContactController.getContactList';

// Realistic data with a list of contacts
const mockGetContactList = require('./data/getContactList.json');

// Mock getContactList Apex wire adapter
jest.mock(
    '@salesforce/apex/ContactController.getContactList',
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

describe('c-apex-wire-method-to-property', () => {
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
            // Create component
            const element = createElement('c-apex-wire-method-to-property', {
                is: ApexWireMethodToProperty
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getContactList.emit(mockGetContactList);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Select elements for validation
            const detailEls = element.shadowRoot.querySelectorAll('p');
            expect(detailEls.length).toBe(mockGetContactList.length);
            expect(detailEls[0].textContent).toBe(mockGetContactList[0].Name);
        });
        it('shows error panel element when error returned', async () => {
            // Create component
            const element = createElement('c-apex-wire-method-to-property', {
                is: ApexWireMethodToProperty
            });
            document.body.appendChild(element);

            // Emit error from @wire
            getContactList.error();

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Check for error panel
            const errorPanelEl =
                element.shadowRoot.querySelector('c-error-panel');
            expect(errorPanelEl).not.toBeNull();
        });
    });

    it('is accessible when data is returned', async () => {
        // Create component
        const element = createElement('c-apex-wire-method-to-property', {
            is: ApexWireMethodToProperty
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getContactList.emit(mockGetContactList);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });

    it('is accessible when error is returned', async () => {
        // Create component
        const element = createElement('c-apex-wire-method-to-property', {
            is: ApexWireMethodToProperty
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getContactList.error();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
