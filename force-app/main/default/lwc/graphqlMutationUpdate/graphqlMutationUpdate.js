import { LightningElement, wire } from 'lwc';
import { gql, graphql, executeMutation } from 'lightning/graphql';

export default class GraphqlMutationUpdate extends LightningElement {
    contact;
    firstName = '';
    lastName = '';
    email = '';
    errors;
    successMessage;
    isLoading = true;
    refreshGraphQL;

    @wire(graphql, {
        query: gql`
            query getContact {
                uiapi {
                    query {
                        Contact(first: 1, orderBy: { Name: { order: ASC } }) {
                            edges {
                                node {
                                    Id
                                    FirstName {
                                        value
                                    }
                                    LastName {
                                        value
                                    }
                                    Email {
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
    wiredContact(result) {
        this.isLoading = false;
        this.errors = undefined;
        this.contact = undefined;

        const { errors, data, refresh } = result;

        if (refresh) {
            this.refreshGraphQL = refresh;
        }

        if (data) {
            const contacts = data.uiapi.query.Contact.edges;
            if (contacts.length > 0) {
                const node = contacts[0].node;
                this.contact = {
                    Id: node.Id,
                    FirstName: node.FirstName?.value || '',
                    LastName: node.LastName?.value || '',
                    Email: node.Email?.value || ''
                };
                this.firstName = this.contact.FirstName;
                this.lastName = this.contact.LastName;
                this.email = this.contact.Email;
            } else {
                this.errors = ['No contacts found'];
            }
        }

        if (errors) {
            this.errors = errors;
        }
    }

    handleFirstNameChange(event) {
        this.firstName = event.target.value;
        this.successMessage = undefined;
    }

    handleLastNameChange(event) {
        this.lastName = event.target.value;
        this.successMessage = undefined;
    }

    handleEmailChange(event) {
        this.email = event.target.value;
        this.successMessage = undefined;
    }

    getUpdateQuery(contactId, firstName, lastName, email) {
        return gql`
            mutation UpdateContact {
                uiapi {
                    ContactUpdate(input: {
                        Id: "${contactId}",
                        Contact: {
                            FirstName: "${firstName}",
                            LastName: "${lastName}",
                            Email: "${email}"
                        }
                    }) {
                        Record {
                            Id
                            FirstName {
                                value
                            }
                            LastName {
                                value
                            }
                            Email {
                                value
                            }
                        }
                    }
                }
            }
        `;
    }

    async handleUpdateContact() {
        if (!this.lastName) {
            this.errors = ['Last Name is required'];
            return;
        }

        this.isLoading = true;
        this.errors = undefined;
        this.successMessage = undefined;

        try {
            const result = await executeMutation({
                query: this.getUpdateQuery(
                    this.contact.Id,
                    this.firstName,
                    this.lastName,
                    this.email
                )
            });

            if (result.errors) {
                this.errors = result.errors;
            } else {
                const updated = result.data.uiapi.ContactUpdate.Record;
                this.successMessage = `Contact updated: ${updated.FirstName?.value || ''} ${updated.LastName?.value}`;
                await this.refreshGraphQL?.();
            }
        } catch (error) {
            this.errors = error;
        } finally {
            this.isLoading = false;
        }
    }
}
