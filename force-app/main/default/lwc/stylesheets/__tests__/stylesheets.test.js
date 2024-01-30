import { createElement } from 'lwc';
import Stylesheets from 'c/stylesheets';

describe('c-misc-stylesheets', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('is accessible', async () => {
        const element = createElement('c-stylesheets', {
            is: Stylesheets
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
