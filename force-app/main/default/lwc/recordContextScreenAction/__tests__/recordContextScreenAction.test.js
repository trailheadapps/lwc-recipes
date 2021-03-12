import { createElement } from 'lwc';
import RecordContextScreenAction from '../recordContextScreenAction';

const PARAMS = {
    recordId: 'a00xx000000bqqDAAQ',
    objectApiName: 'Account'
};

describe('c-record-context-screen-action', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('Test Navigation', () => {
        // Create initial element
        const element = createElement('c-record-context-screen-action', {
            is: RecordContextScreenAction
        });
        /* Assign @api parameters */
        element.recordId = PARAMS.recordId;
        element.objectApiName = PARAMS.objectApiName;

        document.body.appendChild(element);
        const lastTag = element.shadowRoot.lastChild;
        // Await async DOM updates
        return Promise.resolve().then(() => {
            expect(lastTag.textContent).toContain(PARAMS.recordId);
            expect(lastTag.textContent).toContain(PARAMS.objectApiName);
        });
    });
});
