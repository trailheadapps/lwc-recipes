import { createElement } from 'lwc';
import MiscMultipleTemplates from 'c/miscMultipleTemplates';

describe('c-misc-multiple-templates', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('displays templateOne on initial render', () => {
        const TEMPLATE_TEXT_CONTENT = 'Template One';

        // Create initial element
        const element = createElement('c-misc-multiple-templates', {
            is: MiscMultipleTemplates
        });
        document.body.appendChild(element);

        // On initial render templateOne should be displayed
        const pElements = element.shadowRoot.querySelectorAll('p');
        const [pTextElement] = [...pElements].filter(
            (item) => item.textContent === 'Template One'
        );
        expect(pTextElement.textContent).toBe(TEMPLATE_TEXT_CONTENT);
    });

    it('displays templateTwo on click', () => {
        const TEMPLATE_TEXT_CONTENT = 'Template Two';

        // Create initial element
        const element = createElement('c-misc-multiple-templates', {
            is: MiscMultipleTemplates
        });
        document.body.appendChild(element);

        // Simulate user click
        const clickEvent = new CustomEvent('click');
        const button = element.shadowRoot.querySelector('lightning-button');
        button.dispatchEvent(clickEvent);

        // After click, DOM is updated showing templateTwo
        return Promise.resolve().then(() => {
            const pElements = element.shadowRoot.querySelectorAll('p');
            const [pTextElement] = [...pElements].filter(
                (item) => item.textContent === 'Template Two'
            );
            expect(pTextElement.textContent).toBe(TEMPLATE_TEXT_CONTENT);
        });
    });
});
