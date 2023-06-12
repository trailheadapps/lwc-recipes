import { LightningElement, wire } from 'lwc';
import { gql, graphql } from 'lightning/uiGraphQLApi';

const pageSize = 3;

export default class GraphqlPagination extends LightningElement {
    after;
    pageNumber = 1;

    @wire(graphql, {
        query: gql`
            query paginatedContacts($after: String, $pageSize: Int!) {
                uiapi {
                    query {
                        Contact(
                            first: $pageSize
                            after: $after
                            orderBy: { Name: { order: ASC } }
                        ) {
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
                                hasPreviousPage
                            }
                            # Requesting totalCount can have performance implications
                            # for large and/or complex queries. Use with caution.
                            totalCount
                        }
                    }
                }
            }
        `,
        variables: '$variables'
    })
    contacts;

    get variables() {
        return {
            after: this.after || null,
            pageSize
        };
    }

    get currentPageNumber() {
        return this.totalCount === 0 ? 0 : this.pageNumber;
    }

    get isFirstPage() {
        return !this.contacts.data?.uiapi.query.Contact.pageInfo
            .hasPreviousPage;
    }

    get isLastPage() {
        return !this.contacts.data?.uiapi.query.Contact.pageInfo.hasNextPage;
    }

    get totalCount() {
        return this.contacts.data?.uiapi.query.Contact.totalCount || 0;
    }

    get totalPages() {
        return Math.ceil(this.totalCount / pageSize);
    }

    handleNext() {
        if (this.contacts.data?.uiapi.query.Contact.pageInfo.hasNextPage) {
            this.after =
                this.contacts.data.uiapi.query.Contact.pageInfo.endCursor;
            this.pageNumber++;
        }
    }

    handleReset() {
        this.after = null;
        this.pageNumber = 1;
    }
}
