import { createElement } from '@lwc/engine-dom';
import { stateManagerInstanceMock } from '@lwc/state-test-utils';
import graphqlStateManager from 'lightning/stateManagerGraphQL';
import GraphqlStateManager from 'c/graphqlStateManager';

// lightning/stateManagerGraphQL is a platform state manager that does not yet
// ship an sfdx-lwc-jest stub, so provide a virtual mock backed by the shared
// state manager instance mock helper.
jest.mock(
    'lightning/stateManagerGraphQL',
    () => ({ __esModule: true, default: jest.fn() }),
    { virtual: true }
);

// Mock data
const mockAccounts = require('./data/graphqlAccounts.json');
const mockErrors = require('./data/graphqlErrors.json');

// Helper function to wait until the microtask queue is empty.
async function flushPromises() {
    return Promise.resolve();
}

describe('c-graphql-state-manager', () => {
    let stateManager;

    beforeEach(() => {
        jest.clearAllMocks();

        stateManager = stateManagerInstanceMock({
            status: 'loaded',
            data: mockAccounts,
            errors: undefined,
            setQuery: jest.fn(),
            setVariables: jest.fn(),
            setConfig: jest.fn(),
            refresh: jest.fn().mockResolvedValue(undefined)
        });

        graphqlStateManager.mockReturnValue(stateManager);
    });

    afterEach(() => {
        // restore real timers in case a test opted into fake timers
        jest.useRealTimers();
        // The jsdom instance is shared across test cases in a single file so
        // reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    async function createComponent() {
        const element = createElement('c-graphql-state-manager', {
            is: GraphqlStateManager
        });
        document.body.appendChild(element);
        await flushPromises();
        return element;
    }

    it('constructs the state manager with an initial query and variables', async () => {
        await createComponent();

        expect(graphqlStateManager).toHaveBeenCalledTimes(1);
        const initialConfig = graphqlStateManager.mock.calls[0][0];
        expect(initialConfig).toHaveProperty('query');
        expect(initialConfig.variables).toEqual({ searchKey: '%' });
    });

    it('renders an account per edge from the loaded data', async () => {
        const element = await createComponent();

        const accountEls = element.shadowRoot.querySelectorAll('p');
        expect(accountEls.length).toBe(
            mockAccounts.uiapi.query.Account.edges.length
        );
    });

    it('re-queries with a new search key after the debounce elapses', async () => {
        jest.useFakeTimers();
        const element = await createComponent();

        const input = element.shadowRoot.querySelector('lightning-input');
        input.value = 'Acme';
        input.dispatchEvent(new CustomEvent('change'));

        // nothing happens until the debounce timer fires
        expect(stateManager.value.setVariables).not.toHaveBeenCalled();

        jest.runAllTimers();

        expect(stateManager.value.setVariables).toHaveBeenCalledWith({
            searchKey: '%Acme%'
        });
    });

    it('refreshes the query when data is loaded', async () => {
        const element = await createComponent();

        const button = element.shadowRoot.querySelector('lightning-button');
        button.click();

        expect(stateManager.value.refresh).toHaveBeenCalledTimes(1);
    });

    it('displays an error panel when the query fails', async () => {
        stateManager = stateManagerInstanceMock({
            status: 'error',
            data: undefined,
            errors: mockErrors,
            setQuery: jest.fn(),
            setVariables: jest.fn(),
            setConfig: jest.fn(),
            refresh: jest.fn()
        });
        graphqlStateManager.mockReturnValue(stateManager);

        const element = await createComponent();

        const errorPanel = element.shadowRoot.querySelector('c-error-panel');
        expect(errorPanel).not.toBeNull();
    });

    it('is accessible', async () => {
        const element = await createComponent();

        await expect(element).toBeAccessible();
    });
});
