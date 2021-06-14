import { createElement } from 'lwc';
import ApiProperty from 'c/apiProperty';

const PERCENTAGE_DEFAULT = 50;
const PERCENTAGE_CUSTOM = 40;

describe('c-api-property', () => {
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

    it('renders c-chart-bar component with a default percentage value', () => {
        // Create initial element
        const element = createElement('c-api-property', {
            is: ApiProperty
        });
        document.body.appendChild(element);

        // Query chart-bar component
        const chartBarEl = element.shadowRoot.querySelector('c-chart-bar');
        expect(chartBarEl).not.toBeNull();

        // Validation for default value passed down to child component
        expect(chartBarEl.percentage).toBe(PERCENTAGE_DEFAULT);
    });

    it('changes the value of the c-chart-bar child component based on user input', async () => {
        // Create initial element
        const element = createElement('c-api-property', {
            is: ApiProperty
        });
        document.body.appendChild(element);

        // Select input field for simulating user input
        const lightningInputEl =
            element.shadowRoot.querySelector('lightning-input');
        lightningInputEl.value = PERCENTAGE_CUSTOM;
        lightningInputEl.dispatchEvent(new CustomEvent('change'));

        // Query chart-bar component
        const chartBarEl = element.shadowRoot.querySelector('c-chart-bar');

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Query newly set public property on chart-bar component
        expect(chartBarEl.percentage).toBe(PERCENTAGE_CUSTOM);
    });

    it('is accessible', async () => {
        const element = createElement('c-api-property', {
            is: ApiProperty
        });

        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });
});
