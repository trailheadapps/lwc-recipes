import { LightningElement } from 'lwc';
import { gql } from 'lightning/graphql';
import graphqlStateManager from 'lightning/stateManagerGraphQL';

/** The delay used when debouncing the search input before re-querying. */
const DELAY = 300;

const ACCOUNTS_QUERY = gql`
    query searchAccounts($searchKey: String!) {
        uiapi {
            query {
                Account(
                    where: { Name: { like: $searchKey } }
                    first: 10
                    orderBy: { Name: { order: ASC } }
                ) {
                    edges {
                        node {
                            Id
                            Name {
                                value
                            }
                            Industry {
                                value
                            }
                        }
                    }
                }
            }
        }
    }
`;

export default class GraphqlStateManager extends LightningElement {
    // The lightning/stateManagerGraphQL state manager owns the whole GraphQL
    // request lifecycle. Unlike @wire(graphql), we drive it imperatively: give
    // it a query/variables and read status, data and errors back from its
    // reactive `value`.
    accounts = graphqlStateManager({
        query: ACCOUNTS_QUERY,
        variables: { searchKey: '%' }
    });

    get isLoading() {
        return this.accounts.value.status === 'loading';
    }

    get accountList() {
        const edges = this.accounts.value.data?.uiapi.query.Account.edges ?? [];
        return edges.map((edge) => ({
            Id: edge.node.Id,
            Name: edge.node.Name.value,
            Industry: edge.node.Industry.value
        }));
    }

    get errors() {
        return this.accounts.value.errors;
    }

    handleKeyChange(event) {
        // Debounce so we only re-query once the user pauses typing.
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            // Updating variables re-runs the query through the state manager.
            this.accounts.value.setVariables({
                searchKey: searchKey === '' ? '%' : `%${searchKey}%`
            });
        }, DELAY);
    }

    handleRefresh() {
        // refresh() re-fetches the active query. It only resolves once data is
        // already loaded and surfaces any failure through the state manager's
        // `errors` value, so we guard on status and ignore the returned promise.
        if (this.accounts.value.status === 'loaded') {
            this.accounts.value.refresh().catch((error) => error);
        }
    }
}
