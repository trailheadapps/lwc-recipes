import { createElement } from 'lwc';
import GraphqlVariables from 'c/graphqlVariables';
import { graphql } from 'lightning/uiGraphQLApi';

// Mock realistic data
const mockGraphQL = require('./data/graphqlVariablesResponse.json');

describe('c-graphql-variables', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.
    async function flushPromises() {
        return Promise.resolve();
    }

    describe('graphql @wire data', () => {
        it('renders the returned records', async () => {
            // Create component
            const element = createElement('c-graphql-variables', {
                is: GraphqlVariables
            });
            document.body.appendChild(element);

            // Emit data from @wire
            graphql.emit(mockGraphQL);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Select paragraphs for length check
            const contactEls = element.shadowRoot.querySelectorAll('p');
            expect(contactEls.length).toBe(
                mockGraphQL.uiapi.query.Contact.edges.length
            );
        });
    });

    describe('graphql @wire error', () => {
        it('shows error panel element', async () => {
            // Create component
            const element = createElement('c-graphql-variables', {
                is: GraphqlVariables
            });
            document.body.appendChild(element);

            // Emit error from @wire
            graphql.emitErrors(['an error']);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Verify error panel is displayed
            // Check for error panel
            const errorPanelEl =
                element.shadowRoot.querySelector('c-error-panel');
            expect(errorPanelEl).not.toBeNull();
        });
    });

    it('is accessible when data returned', async () => {
        // Create component
        const element = createElement('c-graphql-variables', {
            is: GraphqlVariables
        });
        document.body.appendChild(element);

        // Emit data from @wire
        graphql.emit(mockGraphQL);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });

    it('is accessible when error returned', async () => {
        // Create component
        const element = createElement('c-graphql-variables', {
            is: GraphqlVariables
        });
        document.body.appendChild(element);

        // Emit error from @wire
        graphql.emitErrors(['an error']);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
