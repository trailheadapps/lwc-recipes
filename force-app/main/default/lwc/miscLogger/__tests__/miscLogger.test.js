import { createElement } from 'lwc';
import MiscLogger from 'c/miscLogger';
import { log } from 'lightning/logger';

describe('c-misc-logger', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('When log to event monitoring is clicked, the lightning log function is called', () => {
        // Create component
        const element = createElement('c-misc-logger', {
            is: MiscLogger
        });
        document.body.appendChild(element);

        // Click button
        const buttonEl = element.shadowRoot.querySelector(
            'div.event-monitoring lightning-button'
        );
        buttonEl.click();

        // Check log function has been called
        expect(log).toHaveBeenCalled();
    });
});
