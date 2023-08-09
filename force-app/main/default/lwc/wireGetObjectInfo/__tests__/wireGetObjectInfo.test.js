import { createElement } from 'lwc';
import WireGetObjectInfo from 'c/wireGetObjectInfo';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

// Mock realistic data
const mockGetObjectInfo = require('./data/getObjectInfo.json');

describe('c-wire-get-object-info', () => {
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

    describe('getObjectInfo @wire data', () => {
        it('gets called with value from lightning-input field', async () => {
            const USER_INPUT = 'Account';

            // Create component
            const element = createElement('c-wire-get-object-info', {
                is: WireGetObjectInfo
            });
            document.body.appendChild(element);

            // Select input field for simulating user input
            const inputEl = element.shadowRoot.querySelector('lightning-input');
            inputEl.value = USER_INPUT;
            inputEl.dispatchEvent(new CustomEvent('change'));

            // Click button
            const buttonEl =
                element.shadowRoot.querySelector('lightning-button');
            buttonEl.click();

            // Wait for any asynchronous DOM updates
            await flushPromises();

            expect(getObjectInfo.getLastConfig()).toEqual({
                objectApiName: USER_INPUT
            });
        });

        it('renders the object info value in the pre tag', async () => {
            const USER_INPUT = 'Account';

            // Create component
            const element = createElement('c-wire-get-object-info', {
                is: WireGetObjectInfo
            });
            document.body.appendChild(element);

            // Select input field for simulating user input

            const inputEl = element.shadowRoot.querySelector('lightning-input');
            inputEl.value = USER_INPUT;
            inputEl.dispatchEvent(new CustomEvent('change'));

            // Click button
            const buttonEl =
                element.shadowRoot.querySelector('lightning-button');
            buttonEl.click();

            // Emit data from @wire
            getObjectInfo.emit(mockGetObjectInfo);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Select element for validation
            const preEl = element.shadowRoot.querySelector('pre');
            expect(preEl.textContent).toEqual(
                JSON.stringify(mockGetObjectInfo, null, 2)
            );
        });
    });

    describe('getObjectInfo @wire error', () => {
        it('shows error panel element', async () => {
            // Create component
            const element = createElement('c-wire-get-object-info', {
                is: WireGetObjectInfo
            });
            document.body.appendChild(element);

            // Emit error from @wire
            getObjectInfo.error();

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Check for error panel
            const errorPanelEl =
                element.shadowRoot.querySelector('c-error-panel');
            expect(errorPanelEl).not.toBeNull();
        });
    });

    it('is accessible when object info returned', async () => {
        // Create component
        const element = createElement('c-wire-get-object-info', {
            is: WireGetObjectInfo
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getObjectInfo.emit(mockGetObjectInfo);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });

    it('is accessible when error returned', async () => {
        // Create component
        const element = createElement('c-wire-get-object-info', {
            is: WireGetObjectInfo
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getObjectInfo.error();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
