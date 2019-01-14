import { createElement } from 'lwc';
import MiscNotification from 'c/miscNotification';

describe('c-misc-notification', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders two lightning-input fields, one lightning-combobox, and one lightning-button', () => {
        const expectedInputLabels = ['Title', 'Message'];
        const expectedVariantOptions = [
            { label: 'error', value: 'error' },
            { label: 'warning', value: 'warning' },
            { label: 'success', value: 'success' },
            { label: 'info', value: 'info' }
        ];
        // Create initial element
        const element = createElement('c-misc-notification', {
            is: MiscNotification
        });
        document.body.appendChild(element);

        // Query lightning-input fields
        const inputFieldLabels = Array.from(
            element.shadowRoot.querySelectorAll('lightning-input')
        ).map(el => el.label);
        expect(inputFieldLabels).toEqual(expectedInputLabels);

        // Query lightning-combobox
        const comboboxEl = element.shadowRoot.querySelector(
            'lightning-combobox'
        );
        expect(comboboxEl).not.toBeNull();
        expect(comboboxEl.label).toBe('Variant');
        expect(comboboxEl.options).toEqual(expectedVariantOptions);

        // Query lightning-button
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        expect(buttonEl).not.toBeNull();
        expect(buttonEl.label).toBe('Show Notification');
    });

    it('shows custom toast events based on user input', () => {
        // Create initial element
        const element = createElement('c-misc-notification', {
            is: MiscNotification
        });
        document.body.appendChild(element);

        // Mock handler for toast event
        const handler = jest.fn();
        // Add event listener to catch toast event
        element.addEventListener('lightning__showtoast', handler);

        // Query lightning-button
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.dispatchEvent(new CustomEvent('click'));

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise ends in the
        // rejected state
        return Promise.resolve().then(() => {
            // Check if toast event has been fired
            expect(handler).toHaveBeenCalled();
        });
    });
});
