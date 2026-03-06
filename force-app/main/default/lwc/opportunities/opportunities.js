import { default as opportunitiesStateManager } from 'c/opportunitiesStateManager';
import { LightningElement, wire } from 'lwc';
import { gql, graphql } from 'lightning/graphql';

export default class Opportunities extends LightningElement {
    state = opportunitiesStateManager();

    // result from most recent GraphQL query
    data;
    errors;

    // filter for GraphQL query
    filter = 'ALL';

    @wire(graphql, {
        query: gql`
            query GetOpportunities($where: Opportunity_Filter) {
                uiapi {
                    query {
                        Opportunity(where: $where, first: 50) {
                            edges {
                                node {
                                    Id
                                    Name {
                                        value
                                    }
                                    Amount {
                                        value
                                        displayValue
                                    }
                                    StageName {
                                        value
                                    }
                                    IsClosed {
                                        value
                                    }
                                    OwnerId {
                                        value
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `,
        variables: '$queryVariables'
    })
    wiredOpportunities({ data, errors }) {
        this.data = data;
        this.errors = errors;

        if (data) {
            this.state.value.setOpportunities(
                data.uiapi.query.Opportunity.edges.map((edge) => edge.node)
            );
        } else if (errors) {
            // TODO - better error handling
            console.error('Error fetching opportunities:', errors);
        }
    }

    get queryVariables() {
        const result = {};

        if (this.filter === 'OPEN') {
            result.where = { IsClosed: { eq: false } };
        } else if (this.filter === 'CLOSED') {
            result.where = { IsClosed: { eq: true } };
        } else if (this.filter === 'LARGE') {
            result.where = { Amount: { gt: 100000 } };
        }

        return result;
    }

    filters = [
        { label: 'All Opportunities', value: 'ALL' },
        { label: 'Open Opportunities', value: 'OPEN' },
        { label: 'Closed Opportunities', value: 'CLOSED' },
        { label: 'Large Opportunities (> $100k)', value: 'LARGE' }
    ];

    handleFilterChange(event) {
        this.filter = event.target.value;
    }
}
