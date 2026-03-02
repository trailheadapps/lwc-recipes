import { createElement } from '@lwc/engine-dom';
import GraphqlMutationUpdate from 'c/graphqlMutationUpdate';
import { graphql } from 'lightning/graphql';

// Mock realistic data
const mockGraphQLContact = require('./data/graphqlContactResponse.json');

describe('c-graphql-mutation-update', () => {
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
        it('renders contact form when data is returned', async () => {
            const element = createElement('c-graphql-mutation-update', {
                is: GraphqlMutationUpdate
            });
            document.body.appendChild(element);

            // Emit data from @wire
            graphql.emit(mockGraphQLContact);

            await flushPromises();

            // Check form inputs are rendered
            const inputEls =
                element.shadowRoot.querySelectorAll('lightning-input');
            expect(inputEls.length).toBe(3);

            // Verify first name is populated
            const firstNameInput = Array.from(inputEls).find(
                (input) => input.label === 'First Name'
            );
            expect(firstNameInput.value).toBe('Amy');
        });

        it('renders update button', async () => {
            const element = createElement('c-graphql-mutation-update', {
                is: GraphqlMutationUpdate
            });
            document.body.appendChild(element);

            // Emit data from @wire
            graphql.emit(mockGraphQLContact);

            await flushPromises();

            const buttonEl =
                element.shadowRoot.querySelector('lightning-button');
            expect(buttonEl).not.toBeNull();
            expect(buttonEl.label).toBe('Update Contact');
        });
    });

    describe('graphql @wire error', () => {
        it('shows error panel element', async () => {
            const element = createElement('c-graphql-mutation-update', {
                is: GraphqlMutationUpdate
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
        const element = createElement('c-graphql-mutation-update', {
            is: GraphqlMutationUpdate
        });
        document.body.appendChild(element);

        // Emit data from @wire
        graphql.emit(mockGraphQLContact);

        await flushPromises();

        await expect(element).toBeAccessible();
    });

    it('is accessible when error returned', async () => {
        const element = createElement('c-graphql-mutation-update', {
            is: GraphqlMutationUpdate
        });
        document.body.appendChild(element);

        // Emit error from @wire
        graphql.emitErrors(['an error']);

        await flushPromises();

        await expect(element).toBeAccessible();
    });
});
