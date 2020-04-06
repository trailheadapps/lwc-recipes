import { createElement } from 'lwc';
import LibsD3 from 'c/libsD3';
import { ShowToastEventName } from 'lightning/platformShowToastEvent';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';

// Sample error for loadScript error
const LOAD_SCRIPT_ERROR = {
    body: { message: 'An internal server error has occurred' },
    ok: false,
    status: 400,
    statusText: 'Bad Request'
};

describe('c-libs-d3', () => {
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
    function flushPromises() {
        // eslint-disable-next-line no-undef
        return new Promise((resolve) => setImmediate(resolve));
    }

    it('contains a svg element for D3', () => {
        // Create initial element
        const element = createElement('c-libs-d3', {
            is: LibsD3
        });
        document.body.appendChild(element);

        // Querying the DOM element that has the lwc:dom directive set.
        const domEl = element.shadowRoot.querySelector('svg[class="d3"]');
        expect(domEl).not.toBeNull();
    });

    it('loads the D3 javascript and css static resources', () => {
        const D3_JS = 'd3/d3.v5.min.js';
        const D3_CSS = 'd3/style.css';

        // Create initial element
        const element = createElement('c-libs-d3', {
            is: LibsD3
        });
        document.body.appendChild(element);

        // Validation that the loadScript and loadStyle promises
        // are called once.
        expect(loadScript.mock.calls.length).toBe(1);
        expect(loadStyle.mock.calls.length).toBe(1);

        // Validation that the D3 JS and CSS files are passed as parameters.
        expect(loadScript.mock.calls[0][1]).toEqual(D3_JS);
        expect(loadStyle.mock.calls[0][1]).toEqual(D3_CSS);
    });

    it('fires a toast event if the static resource cannot be loaded', () => {
        const TOAST_MESSAGE = 'Error loading D3';
        const TOAST_VARIANT = 'error';

        loadScript.mockRejectedValue(LOAD_SCRIPT_ERROR);

        // Create initial element
        const element = createElement('c-libs-d3', {
            is: LibsD3
        });
        document.body.appendChild(element);

        // Mock handler for toast event
        const handler = jest.fn();
        // Add event listener to catch toast event
        element.addEventListener(ShowToastEventName, handler);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise ends in the
        // rejected state
        return flushPromises().then(() => {
            // Check if toast event has been fired
            expect(handler).toHaveBeenCalled();
            expect(handler.mock.calls[0][0].detail.title).toBe(TOAST_MESSAGE);
            expect(handler.mock.calls[0][0].detail.variant).toBe(TOAST_VARIANT);
        });
    });
});
