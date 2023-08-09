import { createElement } from 'lwc';
import LibsFullCalendar from 'c/libsFullCalendar';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';

// Sample error for loadScript error
const LOAD_SCRIPT_ERROR = {
    body: { message: 'An internal server error has occurred' },
    ok: false,
    status: 400,
    statusText: 'Bad Request'
};

describe('c-libs-full-calendar', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Clear mocks so that every test run has a clean implementation
        jest.clearAllMocks();
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when the platformResourceLoader promises.
    async function flushPromises() {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        return new Promise((resolve) => setTimeout(resolve, 0));
    }

    it('contains a div element for FullCalendar', () => {
        // Create component
        const element = createElement('c-libs-full-calendar', {
            is: LibsFullCalendar
        });
        document.body.appendChild(element);

        // Querying the DOM element that has the lwc:dom directive set.
        const domEl = element.shadowRoot.querySelector('div.calendar');
        expect(domEl).not.toBeNull();
    });

    it('loads the FullCalendar javascript and css static resources', () => {
        const FULL_CALENDAR_JS = 'fullCalendar/main.min.js';
        const FULL_CALENDAR_CSS = 'fullCalendar/main.min.css';

        // Create component
        const element = createElement('c-libs-full-calendar', {
            is: LibsFullCalendar
        });
        document.body.appendChild(element);

        // Validation that the loadScript and loadStyle promises
        // are called once.
        expect(loadScript.mock.calls.length).toBe(1);
        expect(loadStyle.mock.calls.length).toBe(1);

        // Validation that the JS and CSS files are passed as parameters.
        expect(loadScript.mock.calls[0][1]).toEqual(FULL_CALENDAR_JS);
        expect(loadStyle.mock.calls[0][1]).toEqual(FULL_CALENDAR_CSS);
    });

    it('displays error panel if the static resource cannot be loaded', async () => {
        loadScript.mockRejectedValue(LOAD_SCRIPT_ERROR);

        // Create component
        const element = createElement('c-libs-full-calendar', {
            is: LibsFullCalendar
        });
        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check if error panel is displayed
        // Check for error panel
        const errorPanelEl = element.shadowRoot.querySelector('c-error-panel');
        expect(errorPanelEl).not.toBeNull();
    });

    it('is accessible when error', async () => {
        loadScript.mockRejectedValue(LOAD_SCRIPT_ERROR);

        const element = createElement('c-libs-full-calendar', {
            is: LibsFullCalendar
        });
        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });

    it('is accessible when no error', async () => {
        const element = createElement('c-libs-full-calendar', {
            is: LibsFullCalendar
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
