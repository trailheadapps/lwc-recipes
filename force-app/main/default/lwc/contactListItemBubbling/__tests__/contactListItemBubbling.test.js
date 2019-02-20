import { createElement } from 'lwc';
import ContactListItemBubbling from 'c/contactListItemBubbling';

describe('c-contact-list-item-bubbling', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('shows contact name and image based on public property', () => {
        const CONTACT = {
            Id: '99',
            Name: 'Amy Taylor',
            Picture__c: 'https://some.host/image.png'
        };

        const element = createElement('c-contact-list-item-bubbling', {
            is: ContactListItemBubbling
        });
        element.contact = CONTACT;
        document.body.appendChild(element);

        const imgEl = element.shadowRoot.querySelector('img');
        expect(imgEl.src).toBe('https://some.host/image.png');
        const nameEl = element.shadowRoot.querySelector('p');
        expect(nameEl.textContent).toBe('Amy Taylor');
    });
});
