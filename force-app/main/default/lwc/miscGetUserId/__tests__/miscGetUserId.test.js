import { createElement } from 'lwc';
import MiscGetUserId from 'c/miscGetUserId';

// sfdx-lwc-jest automocks @salesforce/user/Id to this const value.
const USER_ID = '005000000000000000';

describe('c-misc-get-user-id', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders with default user id', () => {
        // Create initial element
        const element = createElement('c-misc-get-user-id', {
            is: MiscGetUserId
        });
        document.body.appendChild(element);

        // Query div element that displays user id.
        const divEl = element.shadowRoot.querySelector(
            'div[class="slds-var-m-around_medium"]'
        );
        expect(divEl).not.toBeNull();
        expect(divEl.textContent).toBe('User Id:' + USER_ID);
    });

    it('is accessible', async () => {
        const element = createElement('c-misc-get-user-id', {
            is: MiscGetUserId
        });

        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });
});
