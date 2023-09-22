import { createElement } from 'lwc';
import ContactSelector from 'c/contactSelector';
import getContactList from '@salesforce/apex/ContactController.getContactList';

// Realistic data with a list of contacts
const mockGetContactList = require('./data/getContactList.json');

// Mock getContactList Apex wire adapter
jest.mock(
    '@salesforce/apex/ContactController.getContactList',
    () => {
        const {
            createApexTestWireAdapter
        } = require('@salesforce/sfdx-lwc-jest');
        return {
            default: createApexTestWireAdapter(jest.fn())
        };
    },
    { virtual: true }
);

describe('c-contact-selector', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.
    async function flushPromises() {
        return Promise.resolve();
    }

    it('fires a custom event on user input', async () => {
        const SELECTED_INPUT = '0031700000pJRRSAA4';
        const PAYLOAD = { recordId: SELECTED_INPUT };
        const mockSelectHandler = jest.fn();

        // Create component
        const element = createElement('c-contact-selector', {
            is: ContactSelector
        });
        element.addEventListener('select', mockSelectHandler);
        document.body.appendChild(element);

        // Emit data from @wire
        getContactList.emit(mockGetContactList);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Select combobox for simulating user input
        const comboboxEl =
            element.shadowRoot.querySelector('lightning-combobox');
        comboboxEl.value = SELECTED_INPUT;
        comboboxEl.dispatchEvent(new CustomEvent('change'));

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check that the select event was fired
        expect(mockSelectHandler).toHaveBeenCalledTimes(1);
        const selectEvent = mockSelectHandler.mock.calls[0][0];
        expect(selectEvent.detail).toEqual(PAYLOAD);
    });

    it('shows error panel element when error returned', async () => {
        // Create component
        const element = createElement('c-contact-selector', {
            is: ContactSelector
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getContactList.error();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Validate that the error panel is displayed
        // Check for error panel
        const errorPanelEl = element.shadowRoot.querySelector('c-error-panel');
        expect(errorPanelEl).not.toBeNull();
    });

    it('is accessible when data is returned', async () => {
        // Create component
        const element = createElement('c-contact-selector', {
            is: ContactSelector
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getContactList.emit(mockGetContactList);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });

    it('is accessible when error is returned', async () => {
        // Create component
        const element = createElement('c-contact-selector', {
            is: ContactSelector
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getContactList.error();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
