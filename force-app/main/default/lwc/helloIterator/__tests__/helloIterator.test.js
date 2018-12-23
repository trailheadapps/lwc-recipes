import { createElement } from 'lwc';
import HelloIterator from 'c/helloIterator';

describe('c-hello-iterator', () => {
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
            const element = createElement('c-hello-iterator', {
                is: HelloIterator
            });
            document.body.appendChild(element);
            // Select all list items for length check
            const contactListItems = element.shadowRoot.querySelectorAll('li');
            expect(contactListItems.length).toBe(3);
        });
        it('with contacts in specific order', () => {
            // Create initial element
            const element = createElement('c-hello-iterator', {
                is: HelloIterator
            });
            document.body.appendChild(element);
            // Select all list items for data check
            const contactListItems = element.shadowRoot.querySelectorAll('li');
            expect(contactListItems[0].textContent).toBe(
                'Amy Taylor, VP of Engineering'
            );
            expect(contactListItems[1].textContent).toBe(
                'Michael Jones, VP of Sales'
            );
            expect(contactListItems[2].textContent).toBe('Jennifer Wu, CEO');
        });
        it('with divs rendered for first and last element', () => {
            // Create initial element
            const element = createElement('c-hello-iterator', {
                is: HelloIterator
            });
            document.body.appendChild(element);
            // Select all list items for div check
            const contactListItems = element.shadowRoot.querySelectorAll('li');
            expect(contactListItems[0].firstChild.tagName).toBe('DIV');
            expect(
                contactListItems[contactListItems.length - 1].lastChild.tagName
            ).toBe('DIV');
        });
    });
});
