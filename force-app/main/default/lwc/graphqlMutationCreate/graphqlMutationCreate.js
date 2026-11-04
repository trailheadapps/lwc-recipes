import { LightningElement } from 'lwc';
import { gql, executeMutation } from 'lightning/graphql';

// User input is passed as a variable, never concatenated into the mutation
const CREATE_ACCOUNT = gql`
    mutation CreateAccount($input: AccountCreateInput!) {
        uiapi {
            AccountCreate(input: $input) {
                Record {
                    Id
                    Name {
                        value
                    }
                }
            }
        }
    }
`;

export default class GraphqlMutationCreate extends LightningElement {
    accountName = '';
    accountId;
    errors;
    isLoading = false;

    handleNameChange(event) {
        this.accountName = event.target.value;
        this.accountId = undefined;
        this.errors = undefined;
    }

    async handleCreateAccount() {
        if (!this.accountName) {
            this.errors = ['Account Name is required'];
            return;
        }

        this.isLoading = true;
        this.errors = undefined;
        this.accountId = undefined;

        try {
            const result = await executeMutation({
                query: CREATE_ACCOUNT,
                variables: {
                    input: { Account: { Name: this.accountName } }
                }
            });

            if (result.errors) {
                this.errors = result.errors;
            } else {
                this.accountId = result.data.uiapi.AccountCreate.Record.Id;
                this.accountName = '';
            }
        } catch (error) {
            this.errors = error;
        } finally {
            this.isLoading = false;
        }
    }
}
