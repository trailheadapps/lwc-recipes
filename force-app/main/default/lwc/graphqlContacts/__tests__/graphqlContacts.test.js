import { createElement } from 'lwc';
import GraphqlContacts from 'c/graphqlContacts';
import { graphql } from 'lightning/uiGraphQLApi';

// Mock realistic data
const mockGraphQL = require('./data/graphqlContactsResponse.json');

describe('c-graphql-contacts', () => {
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
        it('renders the records in contact tiles', async () => {
            // Create component
            const element = createElement('c-graphql-contacts', {
                is: GraphqlContacts
            });
            document.body.appendChild(element);

            // Emit data from @wire
            graphql.emit(mockGraphQL);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Select rendered contact tile for length check
            const contactTileEls =
                element.shadowRoot.querySelectorAll('c-contact-tile');
            expect(contactTileEls.length).toBe(
                mockGraphQL.uiapi.query.Contact.edges.length
            );
        });
    });

    describe('graphql @wire error', () => {
        it('shows error panel element', async () => {
            // Create component
            const element = createElement('c-graphql-contacts', {
                is: GraphqlContacts
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
        const element = createElement('c-graphql-contacts', {
            is: GraphqlContacts
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
        const element = createElement('c-graphql-contacts', {
            is: GraphqlContacts
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
