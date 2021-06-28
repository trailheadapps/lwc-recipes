import { createElement } from 'lwc';
import { CloseScreenEventName } from 'lightning/actions';
import ShowCustomUiScreenAction from '../showCustomUiScreenAction';

const RECORD_ID = 'a00xx000000bqqDAAQ';

describe('c-showCustomUiScreenAction', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });
    it('Test Close Screen Action Event', async () => {
        // Create initial element
        const element = createElement('c-showCustomUiScreenAction', {
            is: ShowCustomUiScreenAction
        });
        document.body.appendChild(element);
        // Mock handler for toast event
        const handler = jest.fn();
        // Add event listener to catch toast event
        element.addEventListener(CloseScreenEventName, handler);
        // Select button for simulating user interaction
        const buttonEl = element.shadowRoot.querySelector('button');
        buttonEl.click();
        // Check if close screen event has been fired.
        expect(handler).toHaveBeenCalled();
    });

    it('Test recordId populate', async () => {
        // Create initial element
        const element = createElement('c-showCustomUiScreenAction', {
            is: ShowCustomUiScreenAction
        });
        document.body.appendChild(element);
        /* Assign @api parameters */
        element.recordId = RECORD_ID;
        const radioBtn = element.shadowRoot.querySelectorAll('label');
        // Await async DOM updates
        return Promise.resolve().then(() => {
            // Get the first label element
            expect(radioBtn[0].textContent).toContain(RECORD_ID);
        });
    });
});
