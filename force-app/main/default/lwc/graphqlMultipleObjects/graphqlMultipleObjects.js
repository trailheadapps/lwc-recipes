import { LightningElement, wire } from 'lwc';
import { gql, graphql } from 'lightning/uiGraphQLApi';

export default class GraphqlMultipleObjects extends LightningElement {
    @wire(graphql, {
        query: gql`
            query getAccountAndContacts {
                uiapi {
                    query {
                        Account(first: 5) {
                            edges {
                                node {
                                    Id
                                    Name {
                                        value
                                    }
                                }
                            }
                        }
                        Contact(first: 5) {
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
        `
    })
    graphql;

    get accounts() {
        return this.graphql.data?.uiapi.query.Account.edges.map((edge) => ({
            Id: edge.node.Id,
            Name: edge.node.Name.value
        }));
    }

    get contacts() {
        return this.graphql.data?.uiapi.query.Contact.edges.map((edge) => ({
            Id: edge.node.Id,
            Name: edge.node.Name.value
        }));
    }
}
