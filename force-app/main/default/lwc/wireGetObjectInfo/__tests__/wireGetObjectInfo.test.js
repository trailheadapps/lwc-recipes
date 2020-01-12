import { createElement } from 'lwc';
import WireGetObjectInfo from 'c/wireGetObjectInfo';
import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

// Mock realistic data
const mockGetObjectInfo = require('./data/getObjectInfo.json');

// Register as an LDS wire adapter. Some tests verify the provisioned values trigger desired behavior.
const getObjectInfoAdapter = registerLdsTestWireAdapter(getObjectInfo);

describe('c-wire-get-object-info', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    describe('getObjectInfo @wire data', () => {
        it('gets called with value from lightning-input field', () => {
            const USER_INPUT = 'Account';

            // Create element
            const element = createElement('c-wire-get-object-info', {
                is: WireGetObjectInfo
            });
            document.body.appendChild(element);

            // Select input field for simulating user input
            const inputEl = element.shadowRoot.querySelector('lightning-input');
            inputEl.value = USER_INPUT;
            inputEl.dispatchEvent(new CustomEvent('change'));

            // Select button for simulating user interaction
            const buttonEl = element.shadowRoot.querySelector(
                'lightning-button'
            );
            buttonEl.click();

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                expect(getObjectInfoAdapter.getLastConfig()).toEqual({
                    objectApiName: USER_INPUT
                });
            });
        });

        it('renders the object info value in the pre tag', () => {
            const USER_INPUT = 'Account';

            // Create element
            const element = createElement('c-wire-get-object-info', {
                is: WireGetObjectInfo
            });
            document.body.appendChild(element);

            // Select input field for simulating user input

            const inputEl = element.shadowRoot.querySelector('lightning-input');
            inputEl.value = USER_INPUT;
            inputEl.dispatchEvent(new CustomEvent('change'));

            // Select button for simulating user interaction
            const buttonEl = element.shadowRoot.querySelector(
                'lightning-button'
            );
            buttonEl.click();

            // Emit data from @wire
            getObjectInfoAdapter.emit(mockGetObjectInfo);

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                // Select element for validation
                const preEl = element.shadowRoot.querySelector('pre');
                expect(preEl.textContent).toEqual(
                    JSON.stringify(mockGetObjectInfo, null, 2)
                );
            });
        });
    });

    describe('getObjectInfo @wire error', () => {
        it('shows error panel element', () => {
            // Create initial element
            const element = createElement('c-wire-get-object-info', {
                is: WireGetObjectInfo
            });
            document.body.appendChild(element);

            // Emit error from @wire
            getObjectInfoAdapter.error();

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
