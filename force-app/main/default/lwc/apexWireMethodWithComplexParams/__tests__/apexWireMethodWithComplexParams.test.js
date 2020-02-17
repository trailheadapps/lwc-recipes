import { createElement } from 'lwc';
import ApexWireMethodWithComplexParams from 'c/apexWireMethodWithComplexParams';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import checkApexTypes from '@salesforce/apex/ApexTypesController.checkApexTypes';

// Sample default values for wired Apex call
const WIRE_INPUT_DEFAULT = {
    someString: 'Some string',
    someInteger: 50,
    someList: []
};

// Sample parameter for wired Apex call
const WIRE_INPUT = {
    someString: 'This is a string',
    someInteger: 20,
    someList: [
        { someInnerString: 'This is a string', someInnerInteger: 20 },
        { someInnerString: 'This is a string', someInnerInteger: 20 },
        { someInnerString: 'This is a string', someInnerInteger: 20 }
    ]
};

// Response data for successful custom Apex call
const mockCheckApexTypes =
    'You entered "' +
    WIRE_INPUT.someString +
    '" as String, and "' +
    WIRE_INPUT.someInteger +
    '" as Integer value. The list contained ' +
    WIRE_INPUT.someList.length +
    ' items.';

// Register as Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const checkApexTypesAdapter = registerApexTestWireAdapter(checkApexTypes);

describe('c-apex-wire-method-with-complex-params', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    describe('checkApexTypes @wire data', () => {
        it('gets called with a default configuration', () => {
            // Create initial element
            const element = createElement(
                'c-apex-wire-method-with-complex-params',
                {
                    is: ApexWireMethodWithComplexParams
                }
            );
            document.body.appendChild(element);

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                // Check if the default object is passed as parameter
                expect(checkApexTypesAdapter.getLastConfig()).toEqual({
                    wrapper: WIRE_INPUT_DEFAULT
                });
            });
        });

        it('updates the wire parameter based on user input', () => {
            // Create initial element
            const element = createElement(
                'c-apex-wire-method-with-complex-params',
                {
                    is: ApexWireMethodWithComplexParams
                }
            );
            document.body.appendChild(element);

            // Select input field for simulating string user input
            const inputStringEl = element.shadowRoot.querySelector(
                'lightning-input[class="string-input"]'
            );
            inputStringEl.value = WIRE_INPUT.someString;
            inputStringEl.dispatchEvent(new CustomEvent('change'));

            // Select input field for simulating number user input
            const inputNumberEl = element.shadowRoot.querySelector(
                'lightning-input[class="number-input"]'
            );
            inputNumberEl.value = WIRE_INPUT.someInteger;
            inputNumberEl.dispatchEvent(new CustomEvent('change'));

            // Select input field for simulating list item user input
            const inputListItemEl = element.shadowRoot.querySelector(
                'lightning-input[class="list-item-input"]'
            );
            inputListItemEl.value = WIRE_INPUT.someList.length;
            inputListItemEl.dispatchEvent(new CustomEvent('change'));

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                // Validate parameters of mocked Apex call
                expect(checkApexTypesAdapter.getLastConfig()).toEqual({
                    wrapper: WIRE_INPUT
                });
            });
        });

        it('returns a string value based on user input values', () => {
            // Create initial element
            const element = createElement(
                'c-apex-wire-method-with-complex-params',
                {
                    is: ApexWireMethodWithComplexParams
                }
            );
            document.body.appendChild(element);

            // Select input field for simulating string user input
            const inputStringEl = element.shadowRoot.querySelector(
                'lightning-input[class="string-input"]'
            );
            inputStringEl.value = WIRE_INPUT.someString;
            inputStringEl.dispatchEvent(new CustomEvent('change'));

            // Select input field for simulating number user input
            const inputNumberEl = element.shadowRoot.querySelector(
                'lightning-input[class="number-input"]'
            );
            inputNumberEl.value = WIRE_INPUT.someInteger;
            inputNumberEl.dispatchEvent(new CustomEvent('change'));

            // Select input field for simulating list item user input
            const inputListItemEl = element.shadowRoot.querySelector(
                'lightning-input[class="list-item-input"]'
            );
            inputListItemEl.value = WIRE_INPUT.someList.length;
            inputListItemEl.dispatchEvent(new CustomEvent('change'));

            // Emit data from @wire
            checkApexTypesAdapter.emit(mockCheckApexTypes);

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                // Select element for validation
                const detailEl = element.shadowRoot.querySelector('p');
                expect(detailEl.textContent).toBe(mockCheckApexTypes);
            });
        });
    });

    describe('checkApexTypes @wire error', () => {
        it('renders the error panel when the Apex method returns an error', () => {
            // Create initial element
            const element = createElement(
                'c-apex-imperative-method-with-params',
                {
                    is: ApexWireMethodWithComplexParams
                }
            );
            document.body.appendChild(element);

            // Simulate an Apex error
            checkApexTypesAdapter.error();

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                const errorPanelEl = element.shadowRoot.querySelector(
                    'c-error-panel'
                );
                expect(errorPanelEl).not.toBeNull();
            });
        });
    });
});
