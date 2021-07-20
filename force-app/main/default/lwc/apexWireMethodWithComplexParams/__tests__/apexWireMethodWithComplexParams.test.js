import { createElement } from 'lwc';
import ApexWireMethodWithComplexParams from 'c/apexWireMethodWithComplexParams';
import checkApexTypes from '@salesforce/apex/ApexTypesController.checkApexTypes';

// Mock Apex wire adapter
jest.mock(
    '@salesforce/apex/ApexTypesController.checkApexTypes',
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

describe('c-apex-wire-method-with-complex-params', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.
    async function flushPromises() {
        return Promise.resolve();
    }

    describe('checkApexTypes @wire data', () => {
        it('gets called with a default configuration', async () => {
            // Create initial element
            const element = createElement(
                'c-apex-wire-method-with-complex-params',
                {
                    is: ApexWireMethodWithComplexParams
                }
            );
            document.body.appendChild(element);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Check if the default object is passed as parameter
            expect(checkApexTypes.getLastConfig()).toEqual({
                wrapper: WIRE_INPUT_DEFAULT
            });
        });

        it('updates the wire parameter based on user input', async () => {
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

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Validate parameters of mocked Apex call
            expect(checkApexTypes.getLastConfig()).toEqual({
                wrapper: WIRE_INPUT
            });
        });

        it('returns a string value based on user input values', async () => {
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
            checkApexTypes.emit(mockCheckApexTypes);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Select element for validation
            const detailEl = element.shadowRoot.querySelector('p');
            expect(detailEl.textContent).toBe(mockCheckApexTypes);
        });
    });

    describe('checkApexTypes @wire error', () => {
        it('renders the error panel when the Apex method returns an error', async () => {
            // Create initial element
            const element = createElement(
                'c-apex-imperative-method-with-params',
                {
                    is: ApexWireMethodWithComplexParams
                }
            );
            document.body.appendChild(element);

            // Simulate an Apex error
            checkApexTypes.error();

            // Wait for any asynchronous DOM updates
            await flushPromises();

            const errorPanelEl =
                element.shadowRoot.querySelector('c-error-panel');
            expect(errorPanelEl).not.toBeNull();
        });
    });

    it('is accessible when data returned', async () => {
        // Create initial element
        const element = createElement(
            'c-apex-wire-method-with-complex-params',
            {
                is: ApexWireMethodWithComplexParams
            }
        );
        document.body.appendChild(element);

        // Emit data from @wire
        checkApexTypes.emit(mockCheckApexTypes);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });

    it('is accessible when error returned', async () => {
        // Create initial element
        const element = createElement(
            'c-apex-wire-method-with-complex-params',
            {
                is: ApexWireMethodWithComplexParams
            }
        );
        document.body.appendChild(element);

        // Simulate an Apex error
        checkApexTypes.error();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });
});
