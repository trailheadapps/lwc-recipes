import { LightningElement, wire } from 'lwc';
import { gql, graphql, executeMutation } from 'lightning/graphql';

export default class GraphqlMutationDelete extends LightningElement {
    contacts;
    errors;
    successMessage;
    isLoading = true;
    refreshGraphQL;

    @wire(graphql, {
        query: gql`
            query getContacts {
                uiapi {
                    query {
                        Contact(first: 5, orderBy: { Name: { order: ASC } }) {
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
    wiredContacts(result) {
        this.isLoading = false;
        this.errors = undefined;
        this.contacts = undefined;

        const { errors, data, refresh } = result;

        if (refresh) {
            this.refreshGraphQL = refresh;
        }

        if (data) {
            this.contacts = data.uiapi.query.Contact.edges.map((edge) => ({
                Id: edge.node.Id,
                Name: edge.node.Name.value
            }));
        }

        if (errors) {
            this.errors = errors;
        }
    }

    get noContacts() {
        return !this.contacts || this.contacts.length === 0;
    }

    getDeleteQuery(contactId) {
        return gql`
            mutation DeleteContact {
                uiapi {
                    ContactDelete(input: { Id: "${contactId}" }) {
                        Id
                    }
                }
            }
        `;
    }

    async handleDeleteContact(event) {
        const contactId = event.target.dataset.id;
        const contactName = event.target.dataset.name;

        this.isLoading = true;
        this.errors = undefined;
        this.successMessage = undefined;

        try {
            const result = await executeMutation({
                query: this.getDeleteQuery(contactId)
            });

            if (result.errors) {
                this.errors = result.errors;
            } else {
                this.successMessage = `Contact "${contactName}" deleted successfully`;
                await this.refreshGraphQL?.();
            }
        } catch (error) {
            this.errors = error;
        } finally {
            this.isLoading = false;
        }
    }
}
