import { createElement } from 'lwc';
import GraphqlPagination from 'c/graphqlPagination';
import { graphql } from 'lightning/uiGraphQLApi';

// Mock realistic data
const mockGraphQLFirstPage = require('./data/graphqlPaginationResponseFirstPage.json');
const mockGraphQLLastPage = require('./data/graphqlPaginationResponseLastPage.json');

describe('c-graphql-pagination', () => {
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
            const element = createElement('c-graphql-pagination', {
                is: GraphqlPagination
            });
            document.body.appendChild(element);

            // Emit data from @wire
            graphql.emit(mockGraphQLFirstPage);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Select paragraphs for length check
            const contactEls = element.shadowRoot.querySelectorAll('p');
            expect(contactEls.length).toBe(
                mockGraphQLFirstPage.uiapi.query.Contact.edges.length
            );

            // Reset button should be disabled
            const resetButtonEl = element.shadowRoot.querySelector('.reset');
            expect(resetButtonEl.disabled).toBe(true);

            // Validate status text
            const statusEl = element.shadowRoot.querySelector('.status');
            // eslint-disable-next-line @lwc/lwc/no-inner-html
            expect(statusEl.innerHTML).toEqual('4 items • page 1 of 2');

            // Next button should be enabled
            const nextButtonEl = element.shadowRoot.querySelector('.next');
            expect(nextButtonEl.disabled).toBe(false);
        });

        it('pages forward correctly', async () => {
            // Create component
            const element = createElement('c-graphql-pagination', {
                is: GraphqlPagination
            });
            document.body.appendChild(element);

            // Emit data from @wire
            graphql.emit(mockGraphQLFirstPage);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Advance to the next page
            const buttonEl = element.shadowRoot.querySelector('.next');
            buttonEl.click();

            // Wait for wire config to update
            await flushPromises();

            expect(graphql.getLastConfig().variables.after).toEqual(
                mockGraphQLFirstPage.uiapi.query.Contact.pageInfo.endCursor
            );
            graphql.emit(mockGraphQLLastPage);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Select paragraphs for length check
            const contactEls = element.shadowRoot.querySelectorAll('p');
            expect(contactEls.length).toBe(
                mockGraphQLLastPage.uiapi.query.Contact.edges.length
            );

            // Reset button should be enabled
            const resetButtonEl = element.shadowRoot.querySelector('.reset');
            expect(resetButtonEl.disabled).toBe(false);

            // Validate status text
            const statusEl = element.shadowRoot.querySelector('.status');
            // eslint-disable-next-line @lwc/lwc/no-inner-html
            expect(statusEl.innerHTML).toEqual('4 items • page 2 of 2');

            // Next button should be disabled
            const nextButtonEl = element.shadowRoot.querySelector('.next');
            expect(nextButtonEl.disabled).toBe(true);
        });
    });

    describe('graphql @wire error', () => {
        it('shows error panel element', async () => {
            // Create component
            const element = createElement('c-graphql-pagination', {
                is: GraphqlPagination
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
        const element = createElement('c-graphql-pagination', {
            is: GraphqlPagination
        });
        document.body.appendChild(element);

        // Emit data from @wire
        graphql.emit(mockGraphQLFirstPage);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });

    it('is accessible when error returned', async () => {
        // Create component
        const element = createElement('c-graphql-pagination', {
            is: GraphqlPagination
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
