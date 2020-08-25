import { createElement } from 'lwc';
import MiscGetUserId from 'c/miscGetUserId';

// sfdx-lwc-jest automocks @salesforce/user/Id to this const value.
const USER_ID = '005000000000000000';

describe('c-misc-get-user-id', () => {
    it('renders with default user id ', () => {
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
});
