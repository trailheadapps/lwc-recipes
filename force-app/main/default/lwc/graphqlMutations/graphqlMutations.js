import { LightningElement, wire } from 'lwc';
import { gql, graphql, executeMutation } from 'lightning/graphql';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import TITLE_FIELD from '@salesforce/schema/Contact.Title';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';

const COLS = [
    {
        label: 'Name',
        fieldName: FIRSTNAME_FIELD.fieldApiName,
        editable: true
    },
    {
        label: 'Last Name',
        fieldName: LASTNAME_FIELD.fieldApiName,
        editable: true
    },
    { label: 'Title', fieldName: TITLE_FIELD.fieldApiName, editable: true },
    {
        label: 'Phone',
        fieldName: PHONE_FIELD.fieldApiName,
        type: 'phone',
        editable: true
    },
    {
        label: 'Email',
        fieldName: EMAIL_FIELD.fieldApiName,
        type: 'email',
        editable: true
    }
];
export default class GraphqlMutations extends LightningElement {
    columns = COLS;
    draftValues = [];
    refreshGraphQL;
    contacts;
    errors;

    // Using GraphQL to get contacts
    @wire(graphql, {
        query: gql`
            query getContacts {
                uiapi {
                    query {
                        Contact{
                            edges {
                                node {
                                    Id
                                    FirstName {
                                        value
                                    }
                                    LastName {
                                        value
                                    }
                                    Phone {
                                        value
                                    }
                                    Title {
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
   wiredValues(result) {
        this.isLoading = false;
        this.account = undefined;
        this.errors = undefined;

        const { errors, data, refresh } = result;
        // We hold a reference to the refresh function on the graphQL query result so we can call it later.
        if (refresh) {
            this.refreshGraphQL = refresh;
        }
        if (data) {
            this.contacts = data.uiapi.query.Contact.edges.map((edge) => ({
                Id: edge.node.Id,
                FirstName: edge.node.FirstName.value,
                LastName: edge.node.LastName.value,
                Phone: edge.node.Phone.value,
                Title: edge.node.Title.value,
                Email: edge.node.Email.value
            }));
        }
        if (errors) {
            this.errors = errors;
        }
    }

    async handleSave(event) {
        // Convert datatable draft values into record objects
        const params = event.detail.draftValues.slice().map((draftValue) => {
            const fields = Object.assign({}, draftValue);
            return { fields };
        });

        // Clear all datatable draft values
        this.draftValues = [];

        const variables = this.buildVariables(params);
        const queryRaw = this.buildQuery(params);
        const query = gql`${queryRaw}`;
        try {
            const result = await executeMutation({ query, variables });
            if (result.errors) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'GraphQl Error',
                        message: 'Error in graphql mutation',
                        variant: 'error'
                    })
                );
            } else {
               this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Contacts updated',
                        variant: 'success'
                    })
                );
                // Refresh data in the datatable
                await this.refreshGraphQL?.();
            }
        } catch (error) {
            console.log("HERHERER")
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error while updating or refreshing records',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        }
    }
    buildVariables(params){
        const variables = {}
        // eslint-disable-next-line guard-for-in
        for(let index in params){
            const fields = params[index].fields;
            for(let field of Object.keys(fields)){
                variables[field + index] = fields[field];
            }
        }
        return variables;
    }

    buildQuery(params){
        let header = '';
        let body = '';
        let query = 'mutation ContactUpdateExample(';
        // eslint-disable-next-line guard-for-in
        for(let index in params){
            header+=`$Id${index}: IdOrRef!, $FirstName${index}: String, $LastName${index}: String, $Phone${index}: PhoneNumber, $Title${index}: String, $Email${index}: Email, `;
            let queryBlock = `query${index}: ContactUpdate(input: {
                Contact: {
                    FirstName: $FirstName${index}
                    LastName: $LastName${index}
                    Phone: $Phone${index}
                    Title: $Title${index}
                    Email: $Email${index}
                }
                Id: $Id${index}
                })
                {
                    success
                }`;
            body += queryBlock;
        }
        query+=`${header.slice(0, -2)}){uiapi (input: { allOrNone: false }) { ${body} } }`
        return query.trim();
    }
}
