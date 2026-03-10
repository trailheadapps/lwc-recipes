import { createElement } from '@lwc/engine-dom';
import { fromContext } from '@lwc/state';
import { stateManagerInstanceMock } from '@lwc/state-test-utils';
import opportunitiesStateManager from 'c/opportunitiesStateManager';
import StateManager from 'c/stateManager';
import { graphql } from 'lightning/graphql';

jest.mock('@lwc/state', () => {
    const actual = jest.requireActual('@lwc/state');
    return {
        ...actual,
        fromContext: jest.fn()
    };
});

jest.mock('c/opportunitiesStateManager', () => ({
    __esModule: true,
    default: jest.fn()
}));

// Mock data
const mockAllOpportunities = require('./data/graphqlAllOpportunities.json');
const mockErrors = require('./data/graphqlErrors.json');

// Helper function to wait until the microtask queue is empty. This is needed for promise
// timing.
async function flushPromises() {
    return Promise.resolve();
}

describe('c-stateManager', () => {
    let stateManager;

    beforeEach(() => {
        jest.clearAllMocks();

        stateManager = stateManagerInstanceMock({
            opportunities: [],
            setOpportunities: jest.fn(),
            totalAmount: 0
        });

        // arrange for both defineState() and fromContext() to return our state manager
        // instance mock
        fromContext.mockReturnValue(stateManager);
        opportunitiesStateManager.mockReturnValue(stateManager);
    });

    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('runs an initial GraphQL query to fetch opportunities', async () => {
        const element = createElement('c-stateManager', {
            is: StateManager
        });
        document.body.appendChild(element);

        await flushPromises();

        // @wire(graphql) should have received a query with no filters
        expect(graphql.getLastConfig()).toEqual(
            expect.objectContaining({ variables: {} })
        );

        // @wire(graphql) has not emitted data yet, so state manager should have
        // been initialized with an empty list of opportunities
        expect(
            stateManager.value.setOpportunities.mock.calls[0][0].length
        ).toBe(0);
    });

    it('updates the state manager when GraphQL data is received', async () => {
        const element = createElement('c-stateManager', {
            is: StateManager
        });
        document.body.appendChild(element);

        graphql.emit(mockAllOpportunities);

        await flushPromises();

        // all 11 opportunities from the mock data passed to state manager
        expect(
            stateManager.value.setOpportunities.mock.calls[1][0].length
        ).toBe(11);
    });

    it('handles GraphQL errors', async () => {
        const element = createElement('c-stateManager', {
            is: StateManager
        });
        document.body.appendChild(element);

        // successful query
        graphql.emit(mockAllOpportunities);

        await flushPromises();

        // no error after successful query
        let errorPanel = element.shadowRoot.querySelector('c-error-panel');
        expect(errorPanel).toBeNull();

        // simulate query with errors
        graphql.emitErrors(mockErrors);

        await flushPromises();

        // error panel displayed after query error
        errorPanel = element.shadowRoot.querySelector('c-error-panel');
        expect(errorPanel).not.toBeNull();
    });

    it('updates the GraphQL query filter when the filter is changed', async () => {
        const element = createElement('c-stateManager', {
            is: StateManager
        });
        document.body.appendChild(element);

        await flushPromises();

        const originalQueryVariables = graphql.getLastConfig().variables;

        // simulate user changing the filter to "Open Opportunities"
        const comboboxEl =
            element.shadowRoot.querySelector('lightning-combobox');
        comboboxEl.value = 'OPEN';
        comboboxEl.dispatchEvent(new CustomEvent('change'));

        await flushPromises();

        // graphql query variables should have changed
        expect(graphql.getLastConfig().variables).not.toEqual(
            originalQueryVariables
        );
    });

    it('is accessible', async () => {
        // Arrange
        const element = createElement('c-stateManager', {
            is: StateManager
        });

        // Act
        document.body.appendChild(element);

        await flushPromises();

        await expect(element).toBeAccessible();
    });
});
