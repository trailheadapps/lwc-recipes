import { createElement } from 'lwc';
import ViewToRefresh from 'c/viewToRefresh';
import getTotalNumber from '@salesforce/apex/AccountController.getTotalNumber';
import {
    registerRefreshHandler,
    unregisterRefreshHandler,
    RefreshEvent
} from 'lightning/refresh';
import { refreshApex } from '@salesforce/apex';

// Mock Apex wire adapter
jest.mock(
    '@salesforce/apex/AccountController.getTotalNumber',
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

// Mock refreshApex module
jest.mock(
    '@salesforce/apex',
    () => {
        return {
            refreshApex: jest.fn(() => Promise.resolve())
        };
    },
    { virtual: true }
);

describe('c-view-to-refresh', () => {
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

    it('registers itself as refresh handler on connected callback', () => {
        // Create component
        const element = createElement('c-view-to-refresh', {
            is: ViewToRefresh
        });
        document.body.appendChild(element);

        // Validate if pubsub got registered after connected to the DOM
        expect(registerRefreshHandler).toHaveBeenCalled();
    });

    it('invokes getTotalNumber onload', async () => {
        // Create component
        const element = createElement('c-view-to-refresh', {
            is: ViewToRefresh
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getTotalNumber.emit(10);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check UI
        const divEl = element.shadowRoot.querySelector('div.account-number');
        expect(divEl.textContent).toBe('Number of accounts: 10');
    });

    it('invokes refreshApex when RefreshEvent is listened', async () => {
        // Create component
        const element = createElement('c-view-to-refresh', {
            is: ViewToRefresh
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getTotalNumber.emit(10);

        // Fire a RefreshEvent
        element.dispatchEvent(new RefreshEvent());

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check refreshApex has been called
        expect(refreshApex).toHaveBeenCalled();
    });

    it('unregisters itself as refresh handler on disconnected callback', () => {
        // Create component
        const element = createElement('c-view-to-refresh', {
            is: ViewToRefresh
        });
        document.body.appendChild(element);

        document.body.removeChild(element);

        // Validate if pubsub got registered after connected to the DOM
        expect(unregisterRefreshHandler).toHaveBeenCalled();
    });

    it('is accessible', async () => {
        // Create component
        const element = createElement('c-view-to-refresh', {
            is: ViewToRefresh
        });
        document.body.appendChild(element);

        // Assign mock value for resolved Apex promise
        getTotalNumber.mockResolvedValue(10);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
