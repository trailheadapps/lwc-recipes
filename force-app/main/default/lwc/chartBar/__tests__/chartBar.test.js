import { createElement } from 'lwc';
import ChartBar from 'c/chartBar';

describe('c-chart-bar', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders a lightning-layout with two lightning-layout-items', () => {
        // Create initial element
        const element = createElement('c-chart-bar', {
            is: ChartBar
        });
        document.body.appendChild(element);

        // Query lightning-layout element
        const lightningLayoutEl = element.shadowRoot.querySelector(
            'lightning-layout'
        );
        expect(lightningLayoutEl).not.toBeNull();

        // Query lightning-layout-item elements
        const lightningLayoutItemEls = element.shadowRoot.querySelectorAll(
            'lightning-layout-item'
        );
        expect(lightningLayoutItemEls.length).toBe(2);
    });

    it('renders a div with the percentage value as style attribute', () => {
        // Create initial element
        const element = createElement('c-chart-bar', {
            is: ChartBar
        });

        // Set public property
        element.percentage = 40;
        document.body.appendChild(element);

        // Query div for validating computed style attribute value on component init
        const divEl = element.shadowRoot.querySelector('div.bar');
        expect(divEl).not.toBeNull();
        expect(divEl.style._values.width).toBe('40%');

        // Set public property
        element.percentage = 60;

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Query div for validating computed style attribute value on public property change
            expect(divEl.style._values.width).toBe('60%');
        });
    });
});
