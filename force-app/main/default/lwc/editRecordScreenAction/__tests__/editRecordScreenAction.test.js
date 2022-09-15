import { createElement } from 'lwc';
import { CloseScreenEventName } from 'lightning/actions';
import EditRecordScreenAction from '../editRecordScreenAction';
import { ShowToastEventName } from 'lightning/platformShowToastEvent';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';

const RECORD_ID = 'a00xx000000bqqDAAQ';
const TOAST_MESSAGE = 'Contact updated';

// Mock realistic data
const mockGetRecord = require('./data/getRecord.json');

describe('c-editRecordScreenAction', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('Test populates name from getRecord wire', async () => {
        // Create initial element
        const element = createElement('c-editRecordScreenAction', {
            is: EditRecordScreenAction
        });
        document.body.appendChild(element);
        const firstNameEl = element.shadowRoot.querySelector(
            "[data-field='FirstName']"
        );
        const lastNameEl = element.shadowRoot.querySelector(
            "[data-field='LastName']"
        );
        // Emit data from @wire
        await getRecord.emit(mockGetRecord);

        // Return a promise to wait for any asynchronous DOM updates.
        return Promise.resolve().then(() => {
            expect(firstNameEl.value).toBe('User');
            expect(lastNameEl.value).toBe('User');
        });
    });

    it('Test update record from updateRecord wire on save', async () => {
        // Create initial element
        const element = createElement('c-editRecordScreenAction', {
            is: EditRecordScreenAction
        });
        document.body.appendChild(element);
        // Mock handler for toast event
        const handler = jest.fn();
        element.recordId = RECORD_ID;
        element.addEventListener(ShowToastEventName, handler);

        // Emit data from @wire to populate name field
        await getRecord.emit(mockGetRecord);
        // Find the save button and click
        const inputEl = element.shadowRoot.querySelectorAll('lightning-button');
        inputEl[1].click();

        // Return a promise to wait for any asynchronous DOM updates.
        return Promise.resolve()
            .then(() => {
                const expectedFields = {
                    fields: {
                        Id: RECORD_ID,
                        FirstName: mockGetRecord.fields.FirstName.value,
                        LastName: mockGetRecord.fields.FirstName.value
                    }
                };
                expect(updateRecord).toHaveBeenCalledTimes(1);
                expect(updateRecord).toHaveBeenCalledWith(expectedFields);
            })
            .then(() => {
                // Check if toast event has been fired
                expect(handler).toHaveBeenCalled();
                expect(handler.mock.calls[0][0].detail.message).toBe(
                    TOAST_MESSAGE
                );
            });
    });

    it('Test close screen on Cancel', async () => {
        // Create initial element
        const element = createElement('c-editRecordScreenAction', {
            is: EditRecordScreenAction
        });
        document.body.appendChild(element);
        // Mock handler for toast event
        const handler = jest.fn();
        // Add event listener to catch toast event
        element.addEventListener(CloseScreenEventName, handler);
        // Find the cancel button and click
        const inputEl = element.shadowRoot.querySelectorAll('lightning-button');
        inputEl[0].click();
        // Check if close screen event has been fired.
        expect(handler).toHaveBeenCalled();
    });
});
