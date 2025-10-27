import { LightningElement, wire, api } from 'lwc';
import { gql, graphql } from 'lightning/graphql';
import randomizeAccountData from '@salesforce/apex/AccountController.randomizeAccountData';

export default class GraphqlRefresh extends LightningElement {
    graphqlResult;
    account;
    errors;
    isLoading = true;
    @api refreshGraphQL;

    @wire(graphql, {
        query: gql`
            query getAccount {
                uiapi {
                    query {
                        Account(
                            where: { Name: { eq: "Alpha Dynamics" } }
                            first: 1
                        ) {
                            edges {
                                node {
                                    Id
                                    Name {
                                        value
                                    }
                                    NumberOfEmployees {
                                        value
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `
    })
    wiredValues(result) {
        this.isLoading = false;
        this.account = undefined;
        this.errors = undefined;

        const { errors, data, refresh } = result;
        // We hold a reference to the refresh function on the graphQL query result so we can call it later.
        if(refresh){
            this.refreshGraphQL = refresh;
        }
        if (data) {
            const accounts = data.uiapi.query.Account.edges.map((edge) => ({
                Id: edge.node.Id,
                Name: edge.node.Name.value,
                NumberOfEmployees: edge.node.NumberOfEmployees.value
            }));
            if (accounts.length === 0) {
                this.errors = [`Couldn't find account.`];
            } else {
                this.account = accounts[0];
            }
        }
        if (errors) {
            this.errors = errors;
        }
    }

    async handleRandomizeClick() {
        this.isLoading = true;
        try {
            await randomizeAccountData({ accountId: this.account.Id });
        } catch (e) {
            this.errors = e;
        } finally {
            this.isLoading = false;
        }
    }

    async handleRefreshClick() {
        this.isLoading = true;
        try {
            await this.refreshGraphQL?.();
        } catch (e) {
            this.errors = e;
        } finally {
            this.isLoading = false;
        }
    }
}
