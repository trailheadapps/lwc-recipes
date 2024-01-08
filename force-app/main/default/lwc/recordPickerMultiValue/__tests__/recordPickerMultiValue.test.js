import { createElement } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import RecordPickerMultiValue from 'c/recordPickerMultiValue';

// Mock realistic data
const mockGetRecord = require('./data/wireGetRecordResponse.json');

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

    it('should display the selected record in the pill container', () => {
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
        getRecord.emit(mockGetRecord);

        const pillContainer = element.shadowRoot.querySelector(
            'lightning-pill-container'
        );

        expect(pillContainer.items).toEqual([
            {
                name: '005xx000001X83aAAC',
                label: 'Bob',
                iconName: 'standard:contact'
            }
        ]);
    });

    it('should clear the input when a selection is made', () => {
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

        // Emit data from @wire
        getRecord.emit(mockGetRecord);

        expect(clearSelection).toHaveBeenCalled();
    });

    it('should filter out a record from the suggestions when it has already been selected', () => {
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
        getRecord.emit(mockGetRecord);

        expect(recordPickerElement.filter.criteria).toEqual(
            expect.arrayContaining([
                {
                    fieldPath: 'Id',
                    operator: 'nin',
                    value: ['005xx000001X83aAAC']
                }
            ])
        );
    });

    it('should not filter out anymore a record from the selected record has been removed', () => {
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

        // Simulate a selection removal
        const pillContainer = element.shadowRoot.querySelector(
            'lightning-pill-container'
        );
        pillContainer.dispatchEvent(
            new CustomEvent('itemremove', {
                detail: {
                    item: {
                        name: '005xx000001X83aAAC',
                        label: 'Bob',
                        iconName: 'standard:contact'
                    }
                }
            })
        );

        // no more filter with the selected record id
        expect(recordPickerElement.filter.criteria).toEqual(
            expect.arrayContaining([
                { fieldPath: 'Id', operator: 'nin', value: [] }
            ])
        );
    });
});
