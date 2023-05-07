import { LightningElement, wire } from 'lwc';
import { gql, graphql } from 'lightning/uiGraphQLApi';

export default class GraphqlContacts extends LightningElement {
    @wire(graphql, {
        query: gql`
            query getContacts {
                uiapi {
                    query {
                        Contact (where: { Picture__c: { ne: null } },
                                 first: 5,
                                 orderBy: { Name: { order: ASC } }) {
                            edges {
                                node {
                                    Id
                                    Name {
                                        value
                                    }
                                    Phone {
                                        value
                                    }
                                    Picture__c: Picture__c {
                                        value
                                    }
                                    Title {
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

    get contacts() {
        return this.graphql.data.uiapi.query.Contact.edges.map(edge => ({
            Id: edge.node.Id,
            Name: edge.node.Name.value,
            Phone: edge.node.Phone.value,
            Picture__c: edge.node.Picture__c.value,
            Title: edge.node.Title.value
        }));
    }
}
