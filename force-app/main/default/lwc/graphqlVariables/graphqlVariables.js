import { LightningElement, wire } from 'lwc';
import { gql, graphql } from 'lightning/uiGraphQLApi';

/** The delay used when debouncing event handlers before invoking Apex. */
const DELAY = 300;

export default class GraphqlVariables extends LightningElement {
    searchKey = '';

    @wire(graphql, {
        query: gql`
            query searchContacts ($searchKey: String!, $limit: Int = 5) {
                uiapi {
                    query {
                        Contact (where: { Name: { like: $searchKey } },
                                 first: $limit,
                                 orderBy: { Name: { order: ASC } }) {
                            edges {
                                node {
                                    Id
                                    Name {
                                        value
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `,
        variables: '$variables'
    })
    contacts;

    get variables() {
        return { searchKey: this.searchKey === '' ? '%' : `%${this.searchKey}%` };
    }

    handleKeyChange(event) {
        // Debouncing this method: Do not update the reactive property as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex method calls.
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
        }, DELAY);
    }
}
