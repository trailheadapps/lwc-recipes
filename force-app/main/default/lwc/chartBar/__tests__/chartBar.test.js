import { createElement } from 'lwc';
import ChartBar from 'c/chartBar';

describe('c-chart-bar', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.
    async function flushPromises() {
        return Promise.resolve();
    }

    it('renders a lightning-layout with two lightning-layout-items', () => {
        // Create initial element
        const element = createElement('c-chart-bar', {
            is: ChartBar
        });
        document.body.appendChild(element);

        // Query lightning-layout element
        const lightningLayoutEl =
            element.shadowRoot.querySelector('lightning-layout');
        expect(lightningLayoutEl).not.toBeNull();

        // Query lightning-layout-item elements
        const lightningLayoutItemEls = element.shadowRoot.querySelectorAll(
            'lightning-layout-item'
        );
        expect(lightningLayoutItemEls.length).toBe(2);
    });

    it('renders a div with the percentage value as style attribute', async () => {
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

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Query div for validating computed style attribute value on public property change
        expect(divEl.style._values.width).toBe('60%');
    });

    it('is accessible', async () => {
        const element = createElement('c-chart-bar', {
            is: ChartBar
        });

        element.percentage = 40;
        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });
});
