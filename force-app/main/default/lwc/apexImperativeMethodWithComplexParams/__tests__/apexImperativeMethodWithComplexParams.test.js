import { createElement } from 'lwc';
import ApexImperativeMethodWithComplexParams from 'c/apexImperativeMethodWithComplexParams';
import checkApexTypes from '@salesforce/apex/ApexTypesController.checkApexTypes';

// Mocking imperative Apex method call
jest.mock(
    '@salesforce/apex/ApexTypesController.checkApexTypes',
    () => {
        return {
            default: jest.fn()
        };
    },
    { virtual: true }
);

// Sample parameter for imperative Apex call
const APEX_PARAMETER = {
    someString: 'This is a string',
    someInteger: 20,
    someList: [
        { someInnerString: 'This is a string', someInnerInteger: 20 },
        { someInnerString: 'This is a string', someInnerInteger: 20 },
        { someInnerString: 'This is a string', someInnerInteger: 20 }
    ]
};

// Sample data for imperative Apex call
const APEX_SUCCESS =
    'You entered "' +
    APEX_PARAMETER.someString +
    '" as String, and "' +
    APEX_PARAMETER.someInteger +
    '" as Integer value. The list contained ' +
    APEX_PARAMETER.someList.length +
    ' items.';

// Sample error for imperative Apex call
const APEX_ERROR = {
    body: { message: 'An internal server error has occurred' },
    ok: false,
    status: 400,
    statusText: 'Bad Request'
};

describe('c-apex-imperative-method-with-complex-params', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.
    async function flushPromises() {
        return Promise.resolve();
    }

    it('passes the user input to the Apex method correctly', async () => {
        // Assign mock value for resolved Apex promise
        checkApexTypes.mockResolvedValue(APEX_SUCCESS);

        // Create initial element
        const element = createElement(
            'c-apex-imperative-method-with-complex-params',
            {
                is: ApexImperativeMethodWithComplexParams
            }
        );
        document.body.appendChild(element);

        // Select input field for simulating string user input
        const inputStringEl = element.shadowRoot.querySelector(
            'lightning-input[class="string-input"]'
        );
        inputStringEl.value = APEX_PARAMETER.someString;
        inputStringEl.dispatchEvent(new CustomEvent('change'));

        // Select input field for simulating number user input
        const inputNumberEl = element.shadowRoot.querySelector(
            'lightning-input[class="number-input"]'
        );
        inputNumberEl.value = APEX_PARAMETER.someInteger;
        inputNumberEl.dispatchEvent(new CustomEvent('change'));

        // Select input field for simulating list item user input
        const inputListItemEl = element.shadowRoot.querySelector(
            'lightning-input[class="list-item-input"]'
        );
        inputListItemEl.value = APEX_PARAMETER.someList.length;
        inputListItemEl.dispatchEvent(new CustomEvent('change'));

        // Select button for executing Apex call
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Validate parameters of mocked Apex call
        expect(checkApexTypes.mock.calls.length).toBe(1);
        expect(checkApexTypes.mock.calls[0][0]).toEqual({
            wrapper: APEX_PARAMETER
        });
    });

    it('renders one contact', async () => {
        // Assign mock value for resolved Apex promise
        checkApexTypes.mockResolvedValue(APEX_SUCCESS);

        // Create initial element
        const element = createElement(
            'c-apex-imperative-method-with-complex-params',
            {
                is: ApexImperativeMethodWithComplexParams
            }
        );
        document.body.appendChild(element);

        // Select input field for simulating string user input
        const inputStringEl = element.shadowRoot.querySelector(
            'lightning-input[class="string-input"]'
        );
        inputStringEl.value = APEX_PARAMETER.someString;
        inputStringEl.dispatchEvent(new CustomEvent('change'));

        // Select input field for simulating number user input
        const inputNumberEl = element.shadowRoot.querySelector(
            'lightning-input[class="number-input"]'
        );
        inputNumberEl.value = APEX_PARAMETER.someInteger;
        inputNumberEl.dispatchEvent(new CustomEvent('change'));

        // Select input field for simulating list item user input
        const inputListItemEl = element.shadowRoot.querySelector(
            'lightning-input[class="list-item-input"]'
        );
        inputListItemEl.value = APEX_PARAMETER.someList.length;
        inputListItemEl.dispatchEvent(new CustomEvent('change'));

        // Select button for executing Apex call
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Select p for validating conditionally changed text content
        const detailEl = element.shadowRoot.querySelector('p');
        expect(detailEl.textContent).toBe(APEX_SUCCESS);
    });

    it('renders the error panel when the Apex method returns an error', async () => {
        // Assing mock value for rejected Apex promise
        checkApexTypes.mockRejectedValue(APEX_ERROR);

        // Create initial element
        const element = createElement('c-apex-imperative-method-with-params', {
            is: ApexImperativeMethodWithComplexParams
        });
        document.body.appendChild(element);

        // Select button for executing Apex call
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        const errorPanelEl = element.shadowRoot.querySelector('c-error-panel');
        expect(errorPanelEl).not.toBeNull();
    });

    it('is accessible on initialization', async () => {
        const element = createElement(
            'c-apex-imperative-method-with-complex-params',
            {
                is: ApexImperativeMethodWithComplexParams
            }
        );

        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });

    it('is accessible when error returned', async () => {
        // Assing mock value for rejected Apex promise
        checkApexTypes.mockRejectedValue(APEX_ERROR);

        // Create initial element
        const element = createElement('c-apex-imperative-method-with-params', {
            is: ApexImperativeMethodWithComplexParams
        });
        document.body.appendChild(element);

        // Select button for executing Apex call
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });
});
