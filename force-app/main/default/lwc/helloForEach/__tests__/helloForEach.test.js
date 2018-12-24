import { createElement } from 'lwc';
import HelloForEach from 'c/helloForEach';

describe('c-hello-for-each', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    describe('Render UI', () => {
        it('with list of three contacts', () => {
            // Create initial element
            const element = createElement('c-hello-for-each', {
                is: HelloForEach
            });
            document.body.appendChild(element);
            // Select all list items for length check
            const contactListItems = element.shadowRoot.querySelectorAll('li');
            expect(contactListItems.length).toBe(3);
        });
        it('with contacts in specific order', () => {
            // Create initial element
            const element = createElement('c-hello-expressions', {
                is: HelloForEach
            });
            document.body.appendChild(element);
            const contactListExpected = [
                'Amy Taylor, VP of Engineering',
                'Michael Jones, VP of Sales',
                'Jennifer Wu, CEO'
            ];
            // Select all list items for data check
            const contactListItems = Array.from(
                element.shadowRoot.querySelectorAll('li')
            ).map(li => li.textContent);
            expect(contactListItems).toEqual(contactListExpected);
        });
    });
});
