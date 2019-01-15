import { createElement } from 'lwc';
import Clock from 'c/clock';

describe('c-clock', () => {
    it('sets current date/time after public function call', () => {
        // Create initial element
        const element = createElement('c-clock', {
            is: Clock
        });
        document.body.appendChild(element);

        // Query lightning-formatted-date-time element
        const lightningDateTimeEl = element.shadowRoot.querySelector(
            'lightning-formatted-date-time'
        );
        const currentDateTimeVal = lightningDateTimeEl.value;

        // Call public function on element
        element.refresh();

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise ends in the
        // rejected state
        return Promise.resolve().then(() => {
            // Compare if tracked property has been assigned a new value.
            expect(lightningDateTimeEl.value).not.toBe(currentDateTimeVal);
        });
    });
});
