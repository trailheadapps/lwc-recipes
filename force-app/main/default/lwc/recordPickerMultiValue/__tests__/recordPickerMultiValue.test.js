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

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.
    async function flushPromises() {
        return Promise.resolve();
    }

    it('renders a lightning-record-picker component', () => {
        const recordPickerElement = element.shadowRoot.querySelector(
            'lightning-record-picker'
        );
        expect(recordPickerElement).toBeTruthy();
    });

    it('is accessible', async () => {
        expect(element).toBeAccessible();
    });

    it('should display the selected record in the pill container', async () => {
        // set selected record
        const recordPickerElement = element.shadowRoot.querySelector(
            'lightning-record-picker'
        );

        // Simulate a record selection in the record picker
        recordPickerElement.dispatchEvent(
            new CustomEvent('change', {
                detail: { recordId: '005xx000001X83aAAC' }
            })
        );

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Emit data from @wire
        getRecord.emit(mockGetRecord);

        // Wait for any asynchronous wire call
        await flushPromises();

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

    it('should clear the input when a selection is made', async () => {
        // set selected record
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

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Emit data from @wire
        getRecord.emit(mockGetRecord);

        // Wait for any asynchronous wire call
        await flushPromises();

        expect(clearSelection).toHaveBeenCalled();
    });

    it('should filter out a record from the suggestions when it has already been selected', async () => {
        // set selected record
        const recordPickerElement = element.shadowRoot.querySelector(
            'lightning-record-picker'
        );

        // Simulate a record selection in the record picker
        recordPickerElement.value = '005xx000001X83aAAC';
        recordPickerElement.dispatchEvent(
            new CustomEvent('change', {
                detail: { recordId: '005xx000001X83aAAC' }
            })
        );

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Emit data from @wire
        getRecord.emit(mockGetRecord);

        // Wait for any asynchronous wire call
        await flushPromises();

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

    it('should not filter out anymore a record from the selecyted record has been removed', async () => {
        // set selected record
        const recordPickerElement = element.shadowRoot.querySelector(
            'lightning-record-picker'
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

        // Wait for any asynchronous DOM updates
        await flushPromises();

        const pillContainer = element.shadowRoot.querySelector(
            'lightning-pill-container'
        );

        // simulate pill removal
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

        // Wait for any asynchronous wire call
        await flushPromises();

        // no more filter with the selected record id
        expect(recordPickerElement.filter.criteria).toEqual(
            expect.arrayContaining([
                { fieldPath: 'Id', operator: 'nin', value: [] }
            ])
        );
    });
});
