import { createElement } from 'lwc';
import LdsNotifyRecordUpdateAvailable from 'c/ldsNotifyRecordUpdateAvailable';
import { getRecord, notifyRecordUpdateAvailable } from 'lightning/uiRecordApi';
import updateContact from '@salesforce/apex/ContactController.updateContact';
import { ShowToastEventName } from 'lightning/platformShowToastEvent';

// Mock realistic data
const mockGetRecord = require('./data/getRecord.json');

// Mock updateContact
jest.mock(
    '@salesforce/apex/ContactController.updateContact',
    () => {
        return {
            default: jest.fn(() => Promise.resolve())
        };
    },
    { virtual: true }
);

// Sample error for Apex call
const UPDATE_CONTACT_ERROR = {
    body: { message: 'An internal server error has occurred' },
    ok: false,
    status: 400,
    statusText: 'Bad Request'
};

describe('c-lds-notify-record-update-available', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // Helper function to wait until the microtask queue is empty.
    // This is needed for promise timing.
    async function flushPromises() {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        return new Promise((resolve) => setTimeout(resolve, 0));
    }

    it('populates name from getRecord wire', async () => {
        // Create component
        const element = createElement('c-lds-notify-record-update-available', {
            is: LdsNotifyRecordUpdateAvailable
        });
        document.body.appendChild(element);
        const firstNameEl = element.shadowRoot.querySelector('.first-name');
        const lastNameEl = element.shadowRoot.querySelector('.last-name');
        // Emit data from @wire
        await getRecord.emit(mockGetRecord);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check input values
        expect(firstNameEl.value).toBe('Amy');
        expect(lastNameEl.value).toBe('Taylor');
    });

    it('should update contact and call notifyRecordUpdateAvailable', async () => {
        // Create component
        const element = createElement('c-lds-notify-record-update-available', {
            is: LdsNotifyRecordUpdateAvailable
        });
        document.body.appendChild(element);

        // Mock handler for toast event
        const toastHandler = jest.fn();
        // Add event listener to catch toast event
        element.addEventListener(ShowToastEventName, toastHandler);

        // Emit data from @wire
        getRecord.emit(mockGetRecord);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Assign values to be updated in the input elements
        const firstNameEl = element.shadowRoot.querySelector('.first-name');
        const lastNameEl = element.shadowRoot.querySelector('.last-name');
        firstNameEl.value = 'John';
        lastNameEl.value = 'Doe';

        // Find the update button and click
        const inputEl = element.shadowRoot.querySelector('lightning-button');
        inputEl.click();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Validate updateContact has been called
        expect(updateContact).toHaveBeenCalledTimes(1);
        // Validate updateContact is called with correct parameters
        expect(updateContact.mock.calls[0]).toEqual([
            { firstName: 'John', lastName: 'Doe' }
        ]);
        // Validate notifyRecordUpdateAvailable is called
        expect(notifyRecordUpdateAvailable).toHaveBeenCalledTimes(1);

        // Validate success toast handler is called
        expect(toastHandler).toHaveBeenCalledTimes(1);
        expect(toastHandler.mock.calls[0][0].detail.variant).toBe('success');
    });

    it('displays an error toast on update record error', async () => {
        // Create component
        const element = createElement('c-lds-notify-record-update-available', {
            is: LdsNotifyRecordUpdateAvailable
        });
        document.body.appendChild(element);

        // Mock handler for toast event
        const toastHandler = jest.fn();
        // Add event listener to catch toast event
        element.addEventListener(ShowToastEventName, toastHandler);

        // Emit data from @wire
        getRecord.emit(mockGetRecord);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Assign mock value for rejected updateContact promise
        updateContact.mockRejectedValue(UPDATE_CONTACT_ERROR);

        // Find the save button and click
        const inputEl = element.shadowRoot.querySelector('lightning-button');
        inputEl.click();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Validate error toast handler is called
        expect(toastHandler).toHaveBeenCalledTimes(1);
        expect(toastHandler.mock.calls[0][0].detail.variant).toBe('error');
    });

    it('is accessible when data is returned', async () => {
        // Create component
        const element = createElement('c-lds-notify-record-update-available', {
            is: LdsNotifyRecordUpdateAvailable
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getRecord.emit(mockGetRecord);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });

    it('is accessible when error is returned', async () => {
        // Create component
        const element = createElement('c-lds-notify-record-update-available', {
            is: LdsNotifyRecordUpdateAvailable
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getRecord.error();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
