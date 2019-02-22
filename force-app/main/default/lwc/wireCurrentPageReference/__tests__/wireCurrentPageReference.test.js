import { createElement } from 'lwc';
import WireCurrentPageReference from 'c/wireCurrentPageReference';
import { CurrentPageReference } from 'lightning/navigation';
import { registerTestWireAdapter } from '@salesforce/lwc-jest';

const mockCurrentPageReference = require('./data/CurrentPageReference.json');

// Register as an standard test wire adapter. Some tests verify the provisioned values trigger desired behavior.
const currentPageReferenceAdapter = registerTestWireAdapter(
    CurrentPageReference
);

describe('c-wire-current-page-reference', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders the current page reference as <pre> tag', () => {
        // Create element
        const element = createElement('c-wire-current-page-reference', {
            is: WireCurrentPageReference
        });
        document.body.appendChild(element);

        const preEl = element.shadowRoot.querySelector('pre');
        expect(preEl).not.toBeNull();

        // TODO Test doesn't work with standard test adapter nor with LDS test adapter.
        currentPageReferenceAdapter.emit(mockCurrentPageReference);

        return Promise.resolve().then(() => {
            expect(preEl.textContent).toBe(
                JSON.stringify(mockCurrentPageReference, null, 2)
            );
        });
    });
});
