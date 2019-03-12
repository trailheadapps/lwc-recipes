import { createElement } from 'lwc';
import LibsMomentjs from 'c/libsMomentjs';
import { loadScript } from 'lightning/platformResourceLoader';

// The Lightning web component relies on data that is calculated
// via the moment.js static resource. Instead of using the default
// mock for loadScript we're creating a custom mock, that then loads
// the JavaScript file from the static resource.
//
// This mock, if needed across multiple Lightning web components,
// can also be added via moduleNameMapper in the jest.config.js
// file.
jest.mock(
    'lightning/platformResourceLoader',
    () => {
        return {
            loadScript() {
                // eslint-disable-next-line no-unused-vars
                return new Promise((resolve, reject) => {
                    global.moment = require('../../../staticresources/moment');
                    resolve();
                });
            }
        };
    },
    { virtual: true }
);

// Sample error for loadScript error
const LOAD_SCRIPT_ERROR = {
    body: { message: 'An internal server error has occurred' },
    ok: false,
    status: 400,
    statusText: 'Bad Request'
};

describe('c-libs-momentjs', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when the platformResourceLoader promises.
    function flushPromises() {
        // eslint-disable-next-line no-undef
        return new Promise(resolve => setImmediate(resolve));
    }

    it('loads the momentjs javascript static resource', () => {
        const MOMENT_JS = 'moment';

        // Create initial element
        const element = createElement('c-libs-momentjs', {
            is: LibsMomentjs
        });
        document.body.appendChild(element);

        // Validation that the loadScript promise is called once.
        // expect(loadScript).resolves.toBe(true);
        // Validation that the chartjs static resource is passed as parameter.
        return flushPromises().then(() => {
            expect(loadScript.mock.calls[0][1]).toEqual(MOMENT_JS);
        });
    });

    it('populates the disabled lightning-input fields with moment.js data based on user input', () => {
        const INPUT_RAW = '2019-03-11T22:30:00.000Z';
        const OUTPUT_EXPECTED = [70, 11];

        // Create initial element
        const element = createElement('c-libs-momentjs', {
            is: LibsMomentjs
        });
        document.body.appendChild(element);

        // Selecting the input element for simulating user input
        const inputEl = element.shadowRoot.querySelector('lightning-input');
        inputEl.value = new Date(INPUT_RAW);
        inputEl.dispatchEvent(new CustomEvent('change'));

        return Promise.resolve().then(() => {
            // Querying all lightning-input fields, and populating the const
            // based on the disabled property on each lightning-input field.
            const values = Array.from(
                element.shadowRoot.querySelectorAll('lightning-input')
            )
                .filter(input => input.disabled)
                .splice(0, 2)
                .map(input => input.value);
            expect(values).toEqual(OUTPUT_EXPECTED);
        });
    });

    it('shows the error panel element on static resource load error', () => {
        loadScript.mockRejectedValue(LOAD_SCRIPT_ERROR);

        // Create initial element
        const element = createElement('c-libs-momentjs', {
            is: LibsMomentjs
        });
        document.body.appendChild(element);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return flushPromises().then(() => {
            const errorPanelEl = element.shadowRoot.querySelector(
                'c-error-panel'
            );
            expect(errorPanelEl).not.toBeNull();
        });
    });
});
