import { createElement } from 'lwc';
import WireGetObjectInfo from 'c/wireGetObjectInfo';
import { registerLdsTestWireAdapter } from '@salesforce/lwc-jest';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

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
            const USER_INPUT = 'Opportunity';

            // Create element
            const element = createElement('c-wire-get-object-info', {
                is: WireGetObjectInfo
            });
            document.body.appendChild(element);

            const inputEl = element.shadowRoot.querySelector('lightning-input');
            inputEl.value = USER_INPUT;
            inputEl.dispatchEvent(new CustomEvent('change'));

            const buttonEl = element.shadowRoot.querySelector(
                'lightning-button'
            );
            buttonEl.dispatchEvent(new CustomEvent('click'));

            //getObjectInfoAdapter.emit(mockGetObjectInfo);

            return Promise.resolve(() => {
                expect(getObjectInfoAdapter.getLastConfig()).toEqual({
                    objectApiName: USER_INPUT
                });
            });
        });

        it('renders the object info value in the pre tag', () => {
            const USER_INPUT = 'Opportunity';

            // Create element
            const element = createElement('c-wire-get-object-info', {
                is: WireGetObjectInfo
            });
            document.body.appendChild(element);

            const inputEl = element.shadowRoot.querySelector('lightning-input');
            inputEl.value = USER_INPUT;
            inputEl.dispatchEvent(new CustomEvent('change'));

            const buttonEl = element.shadowRoot.querySelector(
                'lightning-button'
            );
            buttonEl.dispatchEvent(new CustomEvent('click'));

            getObjectInfoAdapter.emit(mockGetObjectInfo);

            return Promise.resolve(() => {
                const preEl = element.shadowRoot.querySelector('pre');
                expect(preEl.textContent).toBe(JSON.stringify(USER_INPUT));
            });
        });
    });

    describe('getObjectInfo @wire error', () => {
        it('shows error panel element', () => {
            const element = createElement('c-wire-get-object-info', {
                is: WireGetObjectInfo
            });
            document.body.appendChild(element);

            getObjectInfoAdapter.error();

            return Promise.resolve().then(() => {
                const errorPanelEl = element.shadowRoot.querySelector(
                    'c-error-panel'
                );
                expect(errorPanelEl).not.toBeNull();
            });
        });
    });
});
