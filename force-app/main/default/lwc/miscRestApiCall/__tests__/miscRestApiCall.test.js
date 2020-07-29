import { createElement } from 'lwc';
import MiscRestApiCall from 'c/miscRestApiCall';

// Query URL for connecting to Google API
const QUERY_URL =
    'https://www.googleapis.com/books/v1/volumes?langRestrict=en&q=';
// Realistic test data for a successful fetch request.
const FETCH_DATA = require('./data/fetch.json');
// Realistic test data for an unsuccessful fetch request.
const FETCH_ERROR = require('./data/fetchError.json');

describe('c-misc-rest-api-call', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // Helper function to mock a resolved fetch call.
    function mockFetch(data) {
        return jest
            .fn()
            .mockImplementation(() =>
                Promise.resolve({ ok: true, json: () => Promise.resolve(data) })
            );
    }

    // Helper function to mock a rejected fetch call.
    function mockFetchError(error) {
        return jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve(error)
            })
        );
    }

    // Helper function to wait until the microtask queue is empty.
    // This is needed for promise timing.
    function flushPromises() {
        // eslint-disable-next-line no-undef
        return new Promise((resolve) => setImmediate(resolve));
    }

    it('calls the Google Books API based on user input', () => {
        const USER_INPUT = 'Harry Potter';
        const QUERY_INPUT = QUERY_URL + USER_INPUT;

        // Create initial element
        const element = createElement('c-misc-rest-api-call', {
            is: MiscRestApiCall
        });
        document.body.appendChild(element);

        // Mock the successful fetch call. An empty response value is
        // sufficient, as we only test that fetch is called with the
        // expected parameter.
        const fetch = (global.fetch = mockFetch({}));

        // Query the input field for simulating user input.
        const inputEl = element.shadowRoot.querySelector('lightning-input');
        inputEl.value = USER_INPUT;
        inputEl.dispatchEvent(new CustomEvent('change'));

        // Query the button for simulating the user action.
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        return flushPromises().then(() => {
            // Validating that fetch has been called with the
            // expected parameter.
            expect(fetch).toHaveBeenCalledTimes(1);
            expect(fetch.mock.calls[0][0]).toBe(QUERY_INPUT);
        });
    });

    it('renders no book details on default', () => {
        // Create initial element
        const element = createElement('c-misc-rest-api-call', {
            is: MiscRestApiCall
        });
        document.body.appendChild(element);

        // Validating that no p elements are rendered per default.
        const detailEls = element.shadowRoot.querySelectorAll('p');
        expect(detailEls.length).toBe(0);
    });

    it('renders book details based on a user query', () => {
        const USER_INPUT = 'Harry Potter';
        const BOOK_TITLES = FETCH_DATA.items.map((book) => book.title);

        // Create initial element
        const element = createElement('c-misc-rest-api-call', {
            is: MiscRestApiCall
        });
        document.body.appendChild(element);

        // eslint-disable-next-line no-unused-vars
        const fetch = (global.fetch = mockFetch(FETCH_DATA));

        // Query the input field for simulating user input.
        const inputEl = element.shadowRoot.querySelector('lightning-input');
        inputEl.value = USER_INPUT;
        inputEl.dispatchEvent(new CustomEvent('change'));

        // Query the button for simulating the user action.
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        return flushPromises().then(() => {
            // Validating that as many p elements are rendered as book items are
            // returned by fetch, and that they are populated with the book titles.
            const EXPECTED = Array.from(
                element.shadowRoot.querySelectorAll('p')
            ).map((p) => p.tag);
            expect(EXPECTED).toEqual(BOOK_TITLES);
        });
    });

    it('renders an error message when the API request returns an error', () => {
        // Create initial element
        const element = createElement('c-misc-rest-api-call', {
            is: MiscRestApiCall
        });
        document.body.appendChild(element);

        // eslint-disable-next-line no-unused-vars
        const fetch = (global.fetch = mockFetchError(FETCH_ERROR));

        // Query the button for simulating the user action.
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Return an immediate flushed promise (after the Apex call) to then
        // wait for any asynchronous DOM updates. Jest will automatically wait
        // for the Promise chain to complete before ending the test and fail
        // the test if the promise ends in the rejected state
        return flushPromises().then(() => {
            const errorPanelEl = element.shadowRoot.querySelector(
                'c-error-panel'
            );
            expect(errorPanelEl).not.toBeNull();
        });
    });
});
