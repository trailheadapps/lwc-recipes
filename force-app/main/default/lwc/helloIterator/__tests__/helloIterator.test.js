import { createElement } from '@lwc/engine-dom';
import HelloIterator from 'c/helloIterator';

describe('c-hello-iterator', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('displays contacts in specific order', () => {
        const EXPECTED = [
            'Amy Taylor, VP of Engineering',
            'Michael Jones, VP of Sales',
            'Jennifer Wu, CEO'
        ];

        // Create component
        const element = createElement('c-hello-iterator', {
            is: HelloIterator
        });
        document.body.appendChild(element);

        // Verify displayed list
        const contacts = Array.from(
            element.shadowRoot.querySelectorAll('li')
        ).map((li) => li.textContent);
        expect(contacts).toEqual(EXPECTED);
    });

    it('displays div in first and last contacts', () => {
        // Create component
        const element = createElement('c-hello-iterator', {
            is: HelloIterator
        });
        document.body.appendChild(element);

        // Verify first li's first child is a div
        expect(
            element.shadowRoot.querySelector('li:first-child').children[0]
                .tagName
        ).toBe('DIV');
        // Verify last li's last child is a div
        expect(
            element.shadowRoot.querySelector('li:last-child').children[0]
                .tagName
        ).toBe('DIV');
        // Verify no other divs
        expect(element.shadowRoot.querySelectorAll('li > div')).toHaveLength(2);
    });

    it('is accessible on initialization', async () => {
        const element = createElement('c-hello-iterator', {
            is: HelloIterator
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
