import { createElement } from '@lwc/engine-dom';
import GraphqlMutationCreate from 'c/graphqlMutationCreate';

// Mock executeMutation from lightning/graphql
jest.mock(
    'lightning/graphql',
    () => {
        return {
            gql: jest.fn((strings, ...values) =>
                strings.reduce(
                    (result, string, i) => result + string + (values[i] || ''),
                    ''
                )
            ),
            executeMutation: jest.fn()
        };
    },
    { virtual: true }
);

// Import after mocking
const { executeMutation } = require('lightning/graphql');

// Mock realistic data
const mockCreateAccountResponse = require('./data/createAccountResponse.json');
const MOCK_ACCOUNT_ID =
    mockCreateAccountResponse.data.uiapi.AccountCreate.Record.Id;

describe('c-graphql-mutation-create', () => {
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

    describe('create account mutation', () => {
        it('renders input and button', () => {
            const element = createElement('c-graphql-mutation-create', {
                is: GraphqlMutationCreate
            });
            document.body.appendChild(element);

            const inputEl = element.shadowRoot.querySelector('lightning-input');
            expect(inputEl).not.toBeNull();
            expect(inputEl.label).toBe('Account Name');

            const buttonEl =
                element.shadowRoot.querySelector('lightning-button');
            expect(buttonEl).not.toBeNull();
            expect(buttonEl.label).toBe('Create Account');
        });

        it('calls executeMutation with correct parameters when create is clicked', async () => {
            const ACCOUNT_NAME = 'Test Account';

            executeMutation.mockResolvedValue(mockCreateAccountResponse);

            const element = createElement('c-graphql-mutation-create', {
                is: GraphqlMutationCreate
            });
            document.body.appendChild(element);

            // Set account name
            const inputEl = element.shadowRoot.querySelector('lightning-input');
            inputEl.value = ACCOUNT_NAME;
            inputEl.dispatchEvent(new CustomEvent('change'));

            // Click create button
            const buttonEl =
                element.shadowRoot.querySelector('lightning-button');
            buttonEl.click();

            await flushPromises();

            expect(executeMutation).toHaveBeenCalled();
            const callArgs = executeMutation.mock.calls[0][0];
            // The account name is embedded in the query string, not passed as variables
            expect(callArgs.query).toContain(ACCOUNT_NAME);
        });

        it('displays account id after successful creation', async () => {
            const ACCOUNT_NAME = 'Test Account';

            executeMutation.mockResolvedValue(mockCreateAccountResponse);

            const element = createElement('c-graphql-mutation-create', {
                is: GraphqlMutationCreate
            });
            document.body.appendChild(element);

            // Set account name
            const inputEl = element.shadowRoot.querySelector('lightning-input');
            inputEl.value = ACCOUNT_NAME;
            inputEl.dispatchEvent(new CustomEvent('change'));

            // Click create button
            const buttonEl =
                element.shadowRoot.querySelector('lightning-button');
            buttonEl.click();

            await flushPromises();

            // Check success message
            const successBox = element.shadowRoot.querySelector(
                '.slds-theme_success'
            );
            expect(successBox).not.toBeNull();
            expect(successBox.textContent).toContain(MOCK_ACCOUNT_ID);
        });

        it('shows error when account name is empty', async () => {
            const element = createElement('c-graphql-mutation-create', {
                is: GraphqlMutationCreate
            });
            document.body.appendChild(element);

            // Click create button without entering name
            const buttonEl =
                element.shadowRoot.querySelector('lightning-button');
            buttonEl.click();

            await flushPromises();

            // Check error panel is displayed
            const errorPanelEl =
                element.shadowRoot.querySelector('c-error-panel');
            expect(errorPanelEl).not.toBeNull();
        });

        it('shows error panel when mutation fails', async () => {
            const ACCOUNT_NAME = 'Test Account';

            executeMutation.mockRejectedValue(
                new Error('Account creation failed')
            );

            const element = createElement('c-graphql-mutation-create', {
                is: GraphqlMutationCreate
            });
            document.body.appendChild(element);

            // Set account name
            const inputEl = element.shadowRoot.querySelector('lightning-input');
            inputEl.value = ACCOUNT_NAME;
            inputEl.dispatchEvent(new CustomEvent('change'));

            // Click create button
            const buttonEl =
                element.shadowRoot.querySelector('lightning-button');
            buttonEl.click();

            await flushPromises();
            await flushPromises();

            // Check error panel is displayed
            const errorPanelEl =
                element.shadowRoot.querySelector('c-error-panel');
            expect(errorPanelEl).not.toBeNull();
        });
    });

    it('is accessible', async () => {
        const element = createElement('c-graphql-mutation-create', {
            is: GraphqlMutationCreate
        });
        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });
});
