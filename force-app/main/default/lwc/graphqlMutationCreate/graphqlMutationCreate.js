import { LightningElement } from 'lwc';
import { gql, executeMutation } from 'lightning/graphql';

export default class GraphqlMutationCreate extends LightningElement {
    accountName = '';
    accountId;
    errors;
    isLoading = false;

    getCreateQuery(name) {
        return gql`
            mutation CreateAccount {
                uiapi {
                    AccountCreate(input: { Account: { Name: "${name}" } }) {
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
    }

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
                query: this.getCreateQuery(this.accountName)
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
