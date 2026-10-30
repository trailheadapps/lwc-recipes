import { createElement } from '@lwc/engine-dom';
import GraphqlMutationDelete from 'c/graphqlMutationDelete';
import { graphql, executeMutation } from 'lightning/graphql';

// Mock realistic data
const mockGraphQLContacts = require('./data/graphqlContactsResponse.json');
const mockDeleteContactResponse = require('./data/deleteContactResponse.json');

// Mock executeMutation and keep the graphql wire adapter
jest.mock('lightning/graphql', () => {
    const actual = jest.requireActual('lightning/graphql');
    return {
        ...actual,
        executeMutation: jest.fn()
    };
});

describe('c-graphql-mutation-delete', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    // Helper function to wait until the microtask queue is empty
    async function flushPromises() {
        return Promise.resolve();
    }

    describe('graphql @wire data', () => {
        it('renders contact list when data is returned', async () => {
            const element = createElement('c-graphql-mutation-delete', {
                is: GraphqlMutationDelete
            });
            document.body.appendChild(element);

            // Emit data from @wire
            graphql.emit(mockGraphQLContacts);

            await flushPromises();

            // Check contacts are rendered
            const layoutItems =
                element.shadowRoot.querySelectorAll('lightning-layout');
            expect(layoutItems.length).toBe(3);
        });

        it('renders delete button for each contact', async () => {
            const element = createElement('c-graphql-mutation-delete', {
                is: GraphqlMutationDelete
            });
            document.body.appendChild(element);

            // Emit data from @wire
            graphql.emit(mockGraphQLContacts);

            await flushPromises();

            const deleteButtons = element.shadowRoot.querySelectorAll(
                'lightning-button-icon'
            );
            expect(deleteButtons.length).toBe(3);
        });
    });

    describe('delete contact mutation', () => {
        it('passes the contact id as a variable', async () => {
            executeMutation.mockResolvedValue(mockDeleteContactResponse);

            const element = createElement('c-graphql-mutation-delete', {
                is: GraphqlMutationDelete
            });
            document.body.appendChild(element);

            // Emit data from @wire
            graphql.emit(mockGraphQLContacts);

            await flushPromises();

            // Click the first delete button
            const deleteButton = element.shadowRoot.querySelector(
                'lightning-button-icon'
            );
            deleteButton.click();

            await flushPromises();

            const CONTACT_ID =
                mockGraphQLContacts.uiapi.query.Contact.edges[0].node.Id;
            const callArgs = executeMutation.mock.calls[0][0];
            expect(callArgs.variables).toEqual({
                input: { Id: CONTACT_ID }
            });
        });
    });

    describe('graphql @wire error', () => {
        it('shows error panel element', async () => {
            const element = createElement('c-graphql-mutation-delete', {
                is: GraphqlMutationDelete
            });
            document.body.appendChild(element);

            // Emit error from @wire
            graphql.emitErrors(['an error']);

            await flushPromises();

            // Verify error panel is displayed
            const errorPanelEl =
                element.shadowRoot.querySelector('c-error-panel');
            expect(errorPanelEl).not.toBeNull();
        });
    });

    it('is accessible when data returned', async () => {
        const element = createElement('c-graphql-mutation-delete', {
            is: GraphqlMutationDelete
        });
        document.body.appendChild(element);

        // Emit data from @wire
        graphql.emit(mockGraphQLContacts);

        await flushPromises();

        await expect(element).toBeAccessible();
    });

    it('is accessible when error returned', async () => {
        const element = createElement('c-graphql-mutation-delete', {
            is: GraphqlMutationDelete
        });
        document.body.appendChild(element);

        // Emit error from @wire
        graphql.emitErrors(['an error']);

        await flushPromises();

        await expect(element).toBeAccessible();
    });
});
