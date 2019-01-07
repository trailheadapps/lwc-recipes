import { createElement } from 'lwc';
import MiscGetUserId from 'c/miscGetUserId';

describe('c-misc-get-user-id', () => {
    it('renders with default user id ', () => {
        // Create initial element
        const element = createElement('c-misc-get-user-id', {
            is: MiscGetUserId,
        });
        document.body.appendChild(element);

        // Query div element that displays user id.
        const divEl = element.shadowRoot.querySelector(
            'div[class="slds-m-around_medium"]',
        );
        expect(divEl).not.toBeNull();
        expect(divEl.textContent).toBe('User Id:005000000000000000');
    });
});
