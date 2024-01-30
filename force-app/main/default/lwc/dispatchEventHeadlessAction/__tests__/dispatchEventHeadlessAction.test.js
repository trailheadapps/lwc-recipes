import { createElement } from 'lwc';
import { ShowToastEventName } from 'lightning/platformShowToastEvent';
import DispatchEventHeadlessAction from '../dispatchEventHeadlessAction';

const TOAST_MESSAGE = 'Hi there! Starting...';
describe('c-dispatchEventHeadlessAction', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });
    it('Test Toast message', async () => {
        // Create component
        const element = createElement('c-dispatchEventHeadlessAction', {
            is: DispatchEventHeadlessAction
        });
        document.body.appendChild(element);
        // Mock handler for toast event
        const handler = jest.fn();
        // Add event listener to catch toast event
        element.addEventListener(ShowToastEventName, handler);
        element.invoke();
        // Check if toast event has been fired
        expect(handler).toHaveBeenCalled();
        expect(handler.mock.calls[0][0].detail.message).toBe(TOAST_MESSAGE);
    });
});
