import { createElement } from '@lwc/engine-dom';
import Hello from 'c/hello';

describe('c-hello', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('displays greeting', () => {
        // Create component
        const element = createElement('c-hello', {
            is: Hello
        });
        document.body.appendChild(element);

        // Verify displayed greeting
        const div = element.shadowRoot.querySelector('div');
        expect(div.textContent).toBe('Hello, World!');
    });

    it('is accessible', async () => {
        const element = createElement('c-hello', {
            is: Hello
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
