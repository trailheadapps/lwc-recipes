import { createElement } from 'lwc';
import DatatableInlineEditWithUiApi from 'c/datatableInlineEditWithUiApi';
import getContacts from '@salesforce/apex/ContactController.getContactList';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEventName } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

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

jest.mock(
    '@salesforce/apex',
    () => {
        return {
            refreshApex: jest.fn(() => Promise.resolve())
        };
    },
    { virtual: true }
);

const DRAFT_VALUES = [
    {
        Id: '0031700000pJRRSAA4',
        FirstName: 'Amy',
        LastName: 'Taylor',
        Title: 'VP of Engineering',
        Phone: '4152568563',
        Email: 'amy@new_demo.net'
    },
    {
        Id: '0031700000pJRRTAA4',
        FirstName: 'Michael',
        LastName: 'Jones',
        Title: 'VP of Sales',
        Phone: '4158526633',
        Email: 'michael@new_demo.net'
    }
];

describe('c-datatable-inline-edit-with-ui-api', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    // Helper function to wait until the microtask queue is empty.
    async function flushPromises() {
        return Promise.resolve();
    }

    it('renders six rows in the lightning datatable', async () => {
        const element = createElement('c-datatable-inline-edit-with-ui-api', {
            is: DatatableInlineEditWithUiApi
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getContacts.emit(mockGetContactList);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        const tableEl = element.shadowRoot.querySelector('lightning-datatable');
        expect(tableEl.data.length).toBe(mockGetContactList.length);
        expect(tableEl.data[0].FirstName).toBe(mockGetContactList[0].FirstName);
    });

    it('updates a record on Save', async () => {
        //Only one record should be updated
        const INPUT_PARAMETERS = [{ fields: DRAFT_VALUES[0] }];

        // Create initial element
        const element = createElement('c-datatable-inline-edit-with-ui-api', {
            is: DatatableInlineEditWithUiApi
        });
        document.body.appendChild(element);

        // Mock handler for save event
        const handler = jest.fn();
        // Add event listener to catch save event
        element.addEventListener('save', handler);

        // Emit data from @wire
        getContacts.emit(mockGetContactList);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        //Update the record with the INPUT_PARAMETERS and simulate the Save event
        const tableEl = element.shadowRoot.querySelector('lightning-datatable');
        tableEl.dispatchEvent(
            new CustomEvent('save', {
                detail: {
                    draftValues: DRAFT_VALUES
                }
            })
        );
        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Validate updateRecord call
        expect(updateRecord).toHaveBeenCalled();
        //Validate the update call is made for only one record
        expect(updateRecord.mock.calls[0]).toEqual(INPUT_PARAMETERS);
    });

    it('displays a success toast after record is updated', async () => {
        //Only one record should be updated
        const INPUT_PARAMETERS = [{ fields: DRAFT_VALUES[0] }];

        // Assign mock value for resolved updateRecord promise
        updateRecord.mockResolvedValue(INPUT_PARAMETERS);

        // Create initial element
        const element = createElement('c-datatable-inline-edit-with-ui-api', {
            is: DatatableInlineEditWithUiApi
        });
        document.body.appendChild(element);

        const handler = jest.fn();
        element.addEventListener('save', handler);

        // Mock handler for toast event
        const toastHandler = jest.fn();
        // Add event listener to catch toast event
        element.addEventListener(ShowToastEventName, toastHandler);

        // Emit data from @wire
        getContacts.emit(mockGetContactList);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        //Update the record with the INPUT_PARAMETERS and simulate the Save event
        const tableEl = element.shadowRoot.querySelector('lightning-datatable');
        tableEl.dispatchEvent(
            new CustomEvent('save', {
                detail: {
                    draftValues: DRAFT_VALUES
                }
            })
        );
        // Wait for any asynchronous DOM updates
        await flushPromises();

        expect(toastHandler).toHaveBeenCalled();
        expect(toastHandler.mock.calls[0][0].detail.variant).toBe('success');
        //Validate refreshApex is called and the draft values are reset
        expect(refreshApex).toHaveBeenCalled();
        expect(tableEl.draftValues).toEqual([]);
    });

    it('displays an error toast on update record error', async () => {
        // Assign mock value for rejected updateRecord promise
        updateRecord.mockRejectedValue({
            body: {
                message: 'Error updating or reloading record'
            }
        });

        // Create initial element
        const element = createElement('c-datatable-inline-edit-with-ui-api', {
            is: DatatableInlineEditWithUiApi
        });
        document.body.appendChild(element);

        const handler = jest.fn();
        element.addEventListener('save', handler);

        // Mock handler for toast event
        const toastHandler = jest.fn();
        // Add event listener to catch toast event
        element.addEventListener(ShowToastEventName, toastHandler);

        // Emit data from @wire
        getContacts.emit(mockGetContactList);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        const tableEl = element.shadowRoot.querySelector('lightning-datatable');
        tableEl.dispatchEvent(
            new CustomEvent('save', {
                detail: {
                    draftValues: 'error'
                }
            })
        );
        // Wait for any asynchronous DOM updates
        await flushPromises();

        expect(toastHandler).toHaveBeenCalled();
        expect(toastHandler.mock.calls[0][0].detail.variant).toBe('error');
    });

    it('is accessible when data is returned', async () => {
        // Create initial element
        const element = createElement('c-datatable-inline-edit-with-ui-api', {
            is: DatatableInlineEditWithUiApi
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getContacts.emit(mockGetContactList);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });

    it('is accessible when error is returned', async () => {
        // Create initial element
        const element = createElement('c-datatable-inline-edit-with-ui-api', {
            is: DatatableInlineEditWithUiApi
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getContacts.error();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });
});
