import { wire, LightningElement } from 'lwc';
import { getObjectInfos } from 'lightning/uiObjectInfoApi';
import { gql, graphql } from 'lightning/uiGraphQLApi';

export default class RecordPickerHello extends LightningElement {
    placeholder = 'Search';

    label = 'Record Picker';

    currentObjectApiName = 'Contact';
    objectInfos = [];

    selectedRecordId = '';

    handleChange(event) {
        this.selectedRecordId = event.detail.recordId;
    }

    contact = {};

    get variables() {
        return {
            selectedRecordId: this.selectedRecordId
        };
    }

    @wire(graphql, {
        query: gql`
            query searchContacts($selectedRecordId: ID) {
                uiapi {
                    query {
                        Contact(
                            where: { Id: { eq: $selectedRecordId } }
                            first: 1
                        ) {
                            edges {
                                node {
                                    Id
                                    Name {
                                        value
                                    }
                                    Phone {
                                        value
                                        displayValue
                                    }
                                    Title {
                                        value
                                    }
                                    Picture__c {
                                        value
                                        displayValue
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
    wiredGraphQL({ data, errors }) {
        if (errors) {
            this.dispatchEvent(new CustomEvent('error', { error: errors }));
            return;
        }

        if (!data) {
            return;
        }

        this.contact = data.uiapi.query.Contact.edges.map((edge) => ({
            Id: edge.node.Id,
            Name: edge.node.Name.value,
            Phone: edge.node.Phone.value,
            Picture__c: edge.node.Picture__c.value,
            Title: edge.node.Title.value
        }))[0];
    }

    @wire(getObjectInfos, { objectApiNames: '$objectApiNames' })
    wiredGetObjectInfos({ error, data }) {
        if (error) {
            this.dispatchEvent(new CustomEvent('error', { error: error }));
            return;
        }

        if (!data) {
            return;
        }

        this.objectInfos = [];
        data.results.forEach((result) => {
            const objectInfo = result.result;
            this.objectInfos.push(objectInfo);
        });
        this.isObjectInfoLoading = false;
    }
}
