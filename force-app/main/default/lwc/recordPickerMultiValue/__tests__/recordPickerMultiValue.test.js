import { createElement } from 'lwc';
import { graphql } from 'lightning/uiGraphQLApi';
import RecordPickerMultiValue from 'c/recordPickerMultiValue';

// Mock realistic data
const mockGraphQL = require('./data/graphqlContactResult.json');

// Helper function to wait until the microtask queue is empty. This is needed for promise
// timing when calling imperative Apex.
async function flushPromises() {
    return Promise.resolve();
}

describe('recordPickerMultiValue', () => {
    let element;
    beforeEach(() => {
        // Create component
        element = createElement('c-record-picker-multi-value', {
            is: RecordPickerMultiValue
        });
        element.objectApiName = 'Contact';
        element.label = 'Contact';
        document.body.appendChild(element);
    });

    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    it('is accessible', async () => {
        expect(element).toBeAccessible();
    });

    it('should display the selected record in the pill container', async () => {
        // Set selected record
        const recordPickerElement = element.shadowRoot.querySelector(
            'lightning-record-picker'
        );
        recordPickerElement.value = '005xx000001X83aAAC';
        recordPickerElement.dispatchEvent(
            new CustomEvent('change', {
                detail: { recordId: '005xx000001X83aAAC' }
            })
        );
        await flushPromises();

        // Emit data from @wire
        graphql.emit(mockGraphQL);
        await flushPromises();

        const pillContainer = element.shadowRoot.querySelector(
            'lightning-pill-container'
        );

        expect(pillContainer.items).toEqual([
            {
                name: '005xx000016QpSqAAK',
                label: 'Amy Taylor',
                iconName: 'standard:contact',
                type: 'icon'
            }
        ]);
    });

    it('should clear the input when a selection is made', async () => {
        const recordPickerElement = element.shadowRoot.querySelector(
            'lightning-record-picker'
        );

        // Spy on recordPickerElement.clearSelection()
        const clearSelection = jest.spyOn(
            recordPickerElement,
            'clearSelection'
        );

        // Simulate a record selection in the record picker
        recordPickerElement.value = '005xx000001X83aAAC';
        recordPickerElement.dispatchEvent(
            new CustomEvent('change', {
                detail: { recordId: '005xx000001X83aAAC' }
            })
        );
        await flushPromises();

        // Emit data from @wire
        graphql.emit(mockGraphQL);
        await flushPromises();

        expect(clearSelection).toHaveBeenCalled();
    });

    it('should filter out a record from the suggestions when it has already been selected', async () => {
        // Set selected record
        const recordPickerElement = element.shadowRoot.querySelector(
            'lightning-record-picker'
        );
        recordPickerElement.value = '005xx000016QpSqAAK';
        recordPickerElement.dispatchEvent(
            new CustomEvent('change', {
                detail: { recordId: '005xx000016QpSqAAK' }
            })
        );
        await flushPromises();

        // Emit data from @wire
        graphql.emit(mockGraphQL);
        await flushPromises();

        expect(recordPickerElement.filter.criteria).toEqual(
            expect.arrayContaining([
                {
                    fieldPath: 'Id',
                    operator: 'nin',
                    value: ['005xx000016QpSqAAK']
                }
            ])
        );
    });

    it('should remove the corresponding pill when selected record is removed', async () => {
        // Set selected record
        const recordPickerElement = element.shadowRoot.querySelector(
            'lightning-record-picker'
        );
        recordPickerElement.value = '005xx000001X83aAAC';
        recordPickerElement.dispatchEvent(
            new CustomEvent('change', {
                detail: { recordId: '005xx000001X83aAAC' }
            })
        );
        // Emit data from @wire
        graphql.emit(mockGraphQL);
        await flushPromises();

        // Simulate a selection removal
        const pillContainer = element.shadowRoot.querySelector(
            'lightning-pill-container'
        );
        pillContainer.dispatchEvent(
            new CustomEvent('itemremove', {
                detail: {
                    item: {
                        name: '005xx000016QpSqAAK',
                        label: 'Amy Taylor',
                        iconName: 'standard:contact'
                    }
                }
            })
        );
        await flushPromises();

        // The pill item has been removed
        expect(pillContainer.items).toEqual([]);
    });

    it('should remove a record from filter when it has been removed from selection', async () => {
        // Set selected record
        const recordPickerElement = element.shadowRoot.querySelector(
            'lightning-record-picker'
        );
        recordPickerElement.value = '005xx000001X83aAAC';
        recordPickerElement.dispatchEvent(
            new CustomEvent('change', {
                detail: { recordId: '005xx000001X83aAAC' }
            })
        );
        await flushPromises();

        // Emit data from @wire
        graphql.emit(mockGraphQL);
        await flushPromises();

        // Simulate a selection removal
        const pillContainer = element.shadowRoot.querySelector(
            'lightning-pill-container'
        );
        pillContainer.dispatchEvent(
            new CustomEvent('itemremove', {
                detail: {
                    item: {
                        name: '005xx000016QpSqAAK',
                        label: 'Amy Taylor',
                        iconName: 'standard:contact'
                    }
                }
            })
        );
        await flushPromises();

        // no more filter with the selected record id
        expect(recordPickerElement.filter.criteria).toEqual(
            expect.arrayContaining([
                { fieldPath: 'Id', operator: 'nin', value: [] }
            ])
        );
    });
});
