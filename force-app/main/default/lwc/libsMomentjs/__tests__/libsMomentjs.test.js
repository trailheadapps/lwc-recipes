import { createElement } from 'lwc';
import LibsMomentjs from 'c/libsMomentjs';

// This variable is used to fork the behavior of the following
// mock where we overwrite `lightning/platformResourceLoader`.
//
// Note that it's prefixed with the word `mock`. This is needed
// for using the variable within the mock.
let mockScriptSuccess = true;

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
                return new Promise((resolve, reject) => {
                    // If the variable is false we're simulating an error when loading
                    // the script resource.
                    if (!mockScriptSuccess) {
                        reject('Could not load script');
                    } else {
                        global.moment = require('../../../staticresources/moment');
                        resolve();
                    }
                });
            }
        };
    },
    { virtual: true }
);

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
        return new Promise((resolve) => setImmediate(resolve));
    }

    it('populates the disabled lightning-input fields with moment.js data based on user input', () => {
        // Enforcing to load the static resource via the overwritten function.
        mockScriptSuccess = true;

        const INPUT_RAW = '2019-03-11T22:30:00.000Z';
        // This array holds two values:
        // - 70 represents that the given date from INPUT_RAW is the 70th day of the year
        // - 11 represents that the given date from INPUT_RAW is the 11th week of the year
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
                .filter((input) => input.disabled)
                .splice(0, 2)
                .map((input) => input.value);
            expect(values).toEqual(OUTPUT_EXPECTED);
        });
    });

    it('shows the error panel element on static resource load error', () => {
        // Enforcing to fail loading the static resource via the overwritten function.
        mockScriptSuccess = false;

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
