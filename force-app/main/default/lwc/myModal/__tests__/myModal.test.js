import { createElement } from 'lwc';
import MyModal from 'c/myModal';

describe('c-my-modal', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders the header value based on a public property', () => {
        const HEADER = 'The modal header';

        // Create initial element
        const element = createElement('c-my-modal', {
            is: MyModal
        });
        element.header = HEADER;
        document.body.appendChild(element);

        const headerEl = element.shadowRoot.querySelector(
            'lightning-modal-header'
        );

        expect(headerEl.label).toBe(HEADER);
    });

    //TODO: Add more tests

    it('is accessible when modal shown and public header property is set', async () => {
        const HEADER = 'The modal header';
        const CONTENT = 'The modal content';

        // Create initial element
        const element = createElement('c-my-modal', {
            is: MyModal
        });
        element.header = HEADER;
        element.content = CONTENT;

        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });
});
