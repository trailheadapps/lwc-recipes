import { createElement } from '@lwc/engine-dom';
import GraphqlMutations from 'c/graphqlMutations';
import { graphql, executeMutation } from 'lightning/graphql';
import { ShowToastEventName } from 'lightning/platformShowToastEvent';

// Mock realistic GraphQL contact data
const mockGraphQLContactResponse = require('./data/graphqlContactResponse.json');

// Mock lightning/graphql with wire adapter and executeMutation
jest.mock('lightning/graphql', () => {
    const actual = jest.requireActual('lightning/graphql');
    return {
        ...actual,
        executeMutation: jest.fn(),
        gql: jest.fn((strings, ...values) =>
            strings.reduce(
                (acc, str, i) => acc + str + (i < values.length ? values[i] : ''),
                ''
            )
        )
    };
});

const DRAFT_VALUES = [
    {
        Id: '0031700000pJRRSAA4',
        FirstName: 'Amy',
        LastName: 'Taylor',
        Title: 'VP of Engineering',
        Phone: '4152568563',
        Email: 'amy@new_demo.net'
    },
    {
        Id: '0031700000pJRRTAA4',
        FirstName: 'Michael',
        LastName: 'Jones',
        Title: 'VP of Sales',
        Phone: '4158526633',
        Email: 'michael@new_demo.net'
    }
];

describe('c-graphql-mutations', () => {
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
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        return new Promise((resolve) => setTimeout(resolve, 0));
    }

    describe('graphql @wire data', () => {
        it('renders three rows in the lightning datatable', async () => {
            const element = createElement('c-graphql-mutations', {
                is: GraphqlMutations
            });
            document.body.appendChild(element);

            // Emit data from @wire
            graphql.emit(mockGraphQLContactResponse);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            const tableEl = element.shadowRoot.querySelector('lightning-datatable');

            // Validate the datatable is populated with correct number of records
            expect(tableEl.data.length).toBe(3);

            // Validate the record to have rendered with correct data
            expect(tableEl.data[0].FirstName).toBe('Amy');
            expect(tableEl.data[0].LastName).toBe('Taylor');
            expect(tableEl.data[0].Email).toBe('amy@demo.net');
        });

        it('is accessible when data is returned', async () => {
            const element = createElement('c-graphql-mutations', {
                is: GraphqlMutations
            });
            document.body.appendChild(element);

            // Emit data from @wire
            graphql.emit(mockGraphQLContactResponse);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Check accessibility
            await expect(element).toBeAccessible();
        });
    });


    describe('save handler with executeMutation', () => {
        it('calls executeMutation when save is triggered', async () => {
            // Mock executeMutation to return success
            executeMutation.mockResolvedValue({
                errors: null
            });

            const element = createElement('c-graphql-mutations', {
                is: GraphqlMutations
            });
            document.body.appendChild(element);

            const refreshGraphQL = jest.fn().mockResolvedValue();
            // Emit data from @wire
            graphql.emit(mockGraphQLContactResponse, () => true, refreshGraphQL);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Simulate save event on datatable
            const tableEl = element.shadowRoot.querySelector('lightning-datatable');
            tableEl.dispatchEvent(
                new CustomEvent('save', {
                    detail: {
                        draftValues: DRAFT_VALUES
                    }
                })
            );

            // Wait for any asynchronous DOM updates - need extra time for async operations
            await flushPromises();

            const calledQuery = executeMutation.mock.calls[0][0].query;
            expect(calledQuery).toBe(`mutation ContactUpdateExample($input0: ContactUpdateInput!, $input1: ContactUpdateInput!){uiapi (input: { allOrNone: false }) { query0: ContactUpdate(input: $input0)
                {
                    success
                } query1: ContactUpdate(input: $input1)
                {
                    success
                } } }`);
        });

        it('displays a success toast after records are updated', async () => {
            // Mock executeMutation to return success
            executeMutation.mockResolvedValue({
                errors: null
            });

            const element = createElement('c-graphql-mutations', {
                is: GraphqlMutations
            });
            document.body.appendChild(element);

            // Mock handler for toast event
            const toastHandler = jest.fn();
            element.addEventListener(ShowToastEventName, toastHandler);

            const refreshGraphQL = jest.fn().mockResolvedValue();
            // Emit data from @wire
            graphql.emit(mockGraphQLContactResponse, () => true, refreshGraphQL);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Simulate save event on datatable
            const tableEl = element.shadowRoot.querySelector('lightning-datatable');
            tableEl.dispatchEvent(
                new CustomEvent('save', {
                    detail: {
                        draftValues: DRAFT_VALUES
                    }
                })
            );

            // Wait for any asynchronous DOM updates - need extra time for async operations
            await flushPromises();

            // Validate the toast event is called with success
            expect(toastHandler).toHaveBeenCalled();
            expect(toastHandler.mock.calls[0][0].detail.variant).toBe('success');
            expect(toastHandler.mock.calls[0][0].detail.title).toBe('Success');

            // Validate refreshGraphQL is called and the draft values are reset
            expect(refreshGraphQL).toHaveBeenCalled();
            expect(tableEl.draftValues).toEqual([]);
        });

        it('displays an error toast when graphql mutation returns errors', async () => {
            // Mock executeMutation to return errors
            executeMutation.mockResolvedValue({
                errors: ['GraphQL error occurred']
            });

            const element = createElement('c-graphql-mutations', {
                is: GraphqlMutations
            });
            document.body.appendChild(element);

            // Mock handler for toast event
            const toastHandler = jest.fn();
            element.addEventListener(ShowToastEventName, toastHandler);

            const refreshGraphQL = jest.fn().mockResolvedValue();
            // Emit data from @wire
            graphql.emit(mockGraphQLContactResponse, () => true, refreshGraphQL);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Simulate save event on datatable
            const tableEl = element.shadowRoot.querySelector('lightning-datatable');
            tableEl.dispatchEvent(
                new CustomEvent('save', {
                    detail: {
                        draftValues: DRAFT_VALUES
                    }
                })
            );

            // Wait for any asynchronous DOM updates - need extra time for async operations
            await flushPromises();

            // Validate the toast event is called with error
            expect(toastHandler).toHaveBeenCalled();
            expect(toastHandler.mock.calls[0][0].detail.variant).toBe('error');
            expect(toastHandler.mock.calls[0][0].detail.title).toBe('GraphQl Error');

            // Validate refreshGraphQL is NOT called when there's an error
            expect(refreshGraphQL).not.toHaveBeenCalled();
        });

        it('displays an error toast on executeMutation exception', async () => {
            // Mock executeMutation to reject
            executeMutation.mockRejectedValue({
                body: {
                    message: 'Error executing mutation'
                }
            });

            const element = createElement('c-graphql-mutations', {
                is: GraphqlMutations
            });
            document.body.appendChild(element);

            // Mock handler for toast event
            const toastHandler = jest.fn();
            element.addEventListener(ShowToastEventName, toastHandler);

            const refreshGraphQL = jest.fn().mockResolvedValue();
            // Emit data from @wire
            graphql.emit(mockGraphQLContactResponse, () => true, refreshGraphQL);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Simulate save event on datatable
            const tableEl = element.shadowRoot.querySelector('lightning-datatable');
            tableEl.dispatchEvent(
                new CustomEvent('save', {
                    detail: {
                        draftValues: DRAFT_VALUES
                    }
                })
            );

            // Wait for any asynchronous DOM updates - need extra time for async operations
            await flushPromises();

            // Validate the toast event is called with error
            expect(toastHandler).toHaveBeenCalled();
            expect(toastHandler.mock.calls[0][0].detail.variant).toBe('error');
            expect(toastHandler.mock.calls[0][0].detail.title).toBe(
                'Error while updating or refreshing records'
            );
        });
    });
});

