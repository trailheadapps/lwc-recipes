import { createElement } from 'lwc';
import PubsubSearchBar from 'c/pubsubSearchBar';
import { fireEvent } from 'c/pubsub';
import { registerTestWireAdapter } from '@salesforce/lwc-jest';
import { CurrentPageReference } from 'lightning/navigation';

// Mock out the event firing function to verify it was called with expected parameters.
jest.mock('c/pubsub', () => {
    return {
        fireEvent: jest.fn()
    };
});

// Register as a standard wire adapter because the component under test requires this adapter.
// We don't exercise this wire adapter in the tests.
registerTestWireAdapter(CurrentPageReference);

describe('c-pubsub-search-bar', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('fires a pubsub event on field value change', () => {
        const USER_INPUT = 'Some input';

        // Create initial element
        const element = createElement('c-pubsub-search-bar', {
            is: PubsubSearchBar
        });
        document.body.appendChild(element);

        // Select input field for simulating user input
        const inputEl = element.shadowRoot.querySelector('lightning-input');
        inputEl.value = USER_INPUT;
        inputEl.dispatchEvent(new CustomEvent('change'));

        // Validate if fireEvent got fired after input value has changed
        expect(fireEvent).toHaveBeenCalledWith(
            undefined,
            'searchKeyChange',
            USER_INPUT
        );
    });
});
