import { createElement } from 'lwc';
import ContactTile from 'c/contactTile';

const CONTACT_INPUT = {
    Id: '0031700000pJRRSAA4',
    Name: 'Amy Taylor',
    Title: 'VP of Engineering',
    Phone: '4152568563',
    Email: 'amy@demo.net',
    Picture__c:
        'https://s3-us-west-1.amazonaws.com/sfdc-demo/people/amy_taylor.jpg'
};

describe('c-contact-tile', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    it('renders picture, name, title, and phone number based on public property input', () => {
        const CONTACT_PICTURE_RESULT = CONTACT_INPUT.Picture__c;
        const CONTACT_NAME_RESULT = CONTACT_INPUT.Name;
        const CONTACT_TITLE_RESULT = CONTACT_INPUT.Title;
        const CONTACT_PHONE_RESULT = CONTACT_INPUT.Phone;

        const element = createElement('c-contact-tile', {
            is: ContactTile
        });
        element.contact = CONTACT_INPUT;
        document.body.appendChild(element);

        const imgEl = element.shadowRoot.querySelector('img');
        expect(imgEl.src).toBe(CONTACT_PICTURE_RESULT);

        const detailEls = element.shadowRoot.querySelectorAll('p');
        expect(detailEls[0].textContent).toBe(CONTACT_NAME_RESULT);
        expect(detailEls[1].textContent).toBe(CONTACT_TITLE_RESULT);

        const phoneEl = element.shadowRoot.querySelector(
            'lightning-formatted-phone'
        );
        expect(phoneEl.value).toBe(CONTACT_PHONE_RESULT);
    });

    it('renders an informational message if public property is not set', () => {
        const MESSAGE = 'No contact data available.';

        const element = createElement('c-contact-tile', {
            is: ContactTile
        });
        document.body.appendChild(element);

        const detailEl = element.shadowRoot.querySelector('p');
        expect(detailEl.textContent).toBe(MESSAGE);
    });
});
