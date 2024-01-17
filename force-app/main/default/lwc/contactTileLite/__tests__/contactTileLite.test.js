import { createElement } from 'lwc';
import ContactTile from 'c/contactTile';

const CONTACT_INPUT = {
    Id: '0031700000pJRRSAA4',
    Name: 'Amy Taylor',
    Title: 'VP of Engineering',
    Phone: '4152568563',
    Email: 'amy@demo.net',
    Picture__c:
        'https://s3-us-west-2.amazonaws.com/dev-or-devrl-s3-bucket/sample-apps/people/amy_taylor.jpg'
};

describe('c-contact-tile', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders picture, name, title, and phone number based on public property input', () => {
        // Create component
        const element = createElement('c-contact-tile', {
            is: ContactTile
        });
        // Set public property
        element.contact = CONTACT_INPUT;
        document.body.appendChild(element);

        // Select elements for validation
        const imgEl = element.shadowRoot.querySelector('img');
        expect(imgEl.src).toBe(CONTACT_INPUT.Picture__c);

        const detailEls = element.shadowRoot.querySelectorAll('p');
        expect(detailEls[0].textContent).toBe(CONTACT_INPUT.Name);
        expect(detailEls[1].textContent).toBe(CONTACT_INPUT.Title);

        const phoneEl = element.shadowRoot.querySelector(
            'lightning-formatted-phone'
        );
        expect(phoneEl.value).toBe(CONTACT_INPUT.Phone);
    });

    it('renders an informational message if public property is not set', () => {
        const MESSAGE = 'No contact data available.';

        // Create component
        const element = createElement('c-contact-tile', {
            is: ContactTile
        });
        document.body.appendChild(element);

        // Select element for validation
        const detailEl = element.shadowRoot.querySelector('p');
        expect(detailEl.textContent).toBe(MESSAGE);
    });

    it('is accessible', async () => {
        const element = createElement('c-contact-tile', {
            is: ContactTile
        });

        element.contact = CONTACT_INPUT;
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
