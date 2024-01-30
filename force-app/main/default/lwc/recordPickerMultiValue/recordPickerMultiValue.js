import { LightningElement, wire } from 'lwc';
import { gql, graphql } from 'lightning/uiGraphQLApi';

// As of Winter '24, `lightning-record-picker` only supports a single selection.
// This sample component shows how you can turn `lightning-record-picker` into
// a multi-selection record picker.

// Converts a record to a lightning-pill element
const toContactPill = (record) => ({
    name: record.id,
    label: record.name,
    iconName: 'standard:contact',
    type: 'icon'
});

// Converts a list a IDs to lightning-record-picker filter
const toRecordPickerFilter = (ids) => ({
    criteria: [
        {
            fieldPath: 'Id',
            operator: 'nin', // "not in" operator
            value: ids
        }
    ]
});

export default class RecordPickerMultiValue extends LightningElement {
    /**
     * The id of the last record the user selected using the record picker.
     * Used to trigger graphql @wire calls.
     */
    selectedRecordId;

    /**
     * The list of selected records (id and name).
     * Used to compute and update the list of pill items
     * and to update the record picker filter
     * as we want to filter out already selected records from the record picker suggestions
     */
    selectedRecords = [];

    /**
     * Builds lightning-pill items from `selectedRecords`
     */
    get pillItems() {
        return this.selectedRecords.map(toContactPill);
    }

    /**
     * Builds lightning-record-picker filter from `selectedRecords`
     */
    get recordPickerFilter() {
        // Convert selectedRecords to a list of IDs
        const selectedRecordIds = this.selectedRecords.map(
            (record) => record.id
        );
        return toRecordPickerFilter(selectedRecordIds);
    }

    // Variables for the GraphQL query
    get variables() {
        return this.selectedRecordId
            ? {
                  selectedRecordId: this.selectedRecordId
              }
            : undefined;
    }

    // A GraphQL query is sent after the record picker change event has been dispatched
    // to get the name of the records that are selected in the record picker.
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
        this.wireError = errors;
        if (errors || !data) {
            return;
        }

        const graphqlResults = data.uiapi.query.Contact.edges.map((edge) => ({
            id: edge.node.Id,
            name: edge.node.Name.value
        }));

        // Add to selectedRecords
        const selectedRecord = graphqlResults[0];
        this.selectedRecords = [...this.selectedRecords, selectedRecord];

        // We want the record picker input to be cleared
        // each time the user selects a record suggestion
        this._clearRecordPickerSelection();
    }

    _clearRecordPickerSelection() {
        this.refs.recordPicker.clearSelection();
        this.selectedRecordId = undefined;
    }

    handlePillRemove(event) {
        const recordId = event.detail.item.name;

        // Remove `recordId` from `selectedRecords`
        this.selectedRecords = this.selectedRecords.filter(
            (record) => record.id !== recordId
        );
    }

    handleRecordPickerChange(event) {
        this.selectedRecordId = event.detail.recordId;
    }
}
