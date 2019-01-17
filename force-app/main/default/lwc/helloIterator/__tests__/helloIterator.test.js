import { createElement } from 'lwc';
import HelloIterator from 'c/helloIterator';

describe('c-hello-iterator', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('displays contacts in specific order', () => {
        const expected = [
            'Amy Taylor, VP of Engineering',
            'Michael Jones, VP of Sales',
            'Jennifer Wu, CEO'
        ];

        // Create initial element
        const element = createElement('c-hello-iterator', {
            is: HelloIterator
        });
        document.body.appendChild(element);

        // Verify displayed list
        const contacts = Array.from(
            element.shadowRoot.querySelectorAll('li')
        ).map(li => li.textContent);
        expect(contacts).toEqual(expected);
    });

    it('displays div in first and last contacts', () => {
        // Create initial element
        const element = createElement('c-hello-iterator', {
            is: HelloIterator
        });
        document.body.appendChild(element);

        // Verify first li's first child is a div
        expect(
            element.shadowRoot.querySelector('li:first-child').firstChild
                .tagName
        ).toBe('DIV');
        // Verify last li's last child is a div
        expect(
            element.shadowRoot.querySelector('li:last-child').lastChild.tagName
        ).toBe('DIV');
        // Verify no other divs
        expect(element.shadowRoot.querySelectorAll('li > div')).toHaveLength(2);
    });
});
