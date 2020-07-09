import { createElement } from 'lwc';
import ContinuationComponent from 'c/continuationCmp';

describe('c-continuation-cmp', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders imperative result and wireservice blocks', () => {
        const element = createElement('c-continuation-cmp', {
            is: ContinuationComponent
        });
        document.body.appendChild(element);

        const detailEls = element.shadowRoot.querySelectorAll('div');
        expect(detailEls[0].textContent).toContain(
            '@wire(startRequest) result:'
        );
        expect(detailEls[1].textContent).toContain('Imperative result:');
    });
});
