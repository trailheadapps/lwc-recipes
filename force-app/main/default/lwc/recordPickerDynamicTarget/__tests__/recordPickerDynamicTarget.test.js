import { createElement } from 'lwc';
import RecordPickerDynamicTarget from 'c/recordPickerDynamicTarget';

describe('recordPickerDynamicTarget', () => {
    let element;
    beforeEach(() => {
        // Create component
        element = createElement('c-record-picker-dynamic-target', {
            is: RecordPickerDynamicTarget
        });
        element.objectApiName = 'Account';
        element.label = 'Account';
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

    it('changes the target object of the record picker', async () => {
        // Change the target object
        const targetSelector = element.shadowRoot.querySelector(
            '[data-id="targetSelector"]'
        );
        targetSelector.value = 'Case';
        targetSelector.dispatchEvent(new CustomEvent('change'));

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check that the target object of the record picker has been updated
        const recordPickerElement = element.shadowRoot.querySelector(
            'lightning-record-picker'
        );
        expect(recordPickerElement.objectApiName).toBe('Case');
    });

    it('hides the target selector when a record is selected', async () => {
        const recordPickerElement = element.shadowRoot.querySelector(
            'lightning-record-picker'
        );

        // Simulate a record selection in the record picker
        recordPickerElement.dispatchEvent(
            new CustomEvent('change', {
                detail: { recordId: '0017a00002PJIloAAH' }
            })
        );

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check that the target selector is not displayed anymore
        const targetSelector = element.shadowRoot.querySelector(
            '[data-id="targetSelector"]'
        );
        expect(targetSelector).toBeFalsy();
    });

    it('displays the target selector again after clearing the selected record', async () => {
        const recordPickerElement = element.shadowRoot.querySelector(
            'lightning-record-picker'
        );
        // Simulate a record selection in the record picker
        recordPickerElement.dispatchEvent(
            new CustomEvent('change', {
                detail: { recordId: '0017a00002PJIloAAH' }
            })
        );

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Simulate clearing the selected record' in the record picker
        recordPickerElement.dispatchEvent(
            new CustomEvent('change', { detail: { recordId: null } })
        );

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check that the target selector is not displayed anymore
        const targetSelector = element.shadowRoot.querySelector(
            '[data-id="targetSelector"]'
        );
        expect(targetSelector).toBeTruthy();
    });
});
