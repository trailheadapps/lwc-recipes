import { default as opportunitiesStateManager } from 'c/opportunitiesStateManager';
import { LightningElement, wire } from 'lwc';
import { gql, graphql } from 'lightning/graphql';

export default class StateManager extends LightningElement {
    state = opportunitiesStateManager();

    // errors from most recent GraphQL query
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
                                    }
                                    StageName {
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
        this.errors = errors;

        // update the state manager with any Opportunity data we received
        this.state.value.setOpportunities(
            (data?.uiapi?.query?.Opportunity?.edges || []).map(
                (edge) => edge.node
            )
        );
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
