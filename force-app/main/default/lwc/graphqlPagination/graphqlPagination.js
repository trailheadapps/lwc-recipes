import { LightningElement, wire } from 'lwc';
import { gql, graphql } from 'lightning/uiGraphQLApi';

/** The delay used when debouncing event handlers before invoking Apex. */
const DELAY = 300;

export default class GraphqlPagination extends LightningElement {
    after;

    @wire(graphql, {
        query: gql`
            query searchContacts ($after: String = null) {
                uiapi {
                    query {
                        Contact (first: 3,
                                 after: $after,
                                 orderBy: { Name: { order: ASC } }) {
                            edges {
                                node {
                                    Id
                                    Name {
                                        value
                                    }
                                }
                            }
                            pageInfo {
                                endCursor
                                hasNextPage
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
        return { after: this.after || null };
    }

    get nextDisabled() {
        return ! this.contacts.data?.uiapi.query.Contact.pageInfo.hasNextPage;
    }

    handleReset(event) {
        this.after = undefined;
    }

    handleNextPage(event) {
        if (this.contacts.data?.uiapi.query.Contact.pageInfo.hasNextPage) {
            this.after = this.contacts.data.uiapi.query.Contact.pageInfo.endCursor;
        }
    }
}
