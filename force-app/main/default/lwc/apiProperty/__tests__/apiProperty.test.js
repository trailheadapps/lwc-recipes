import { createElement } from 'lwc';
import ApiProperty from 'c/apiProperty';

describe('c-api-property', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders a lightning-input element and a c-chart-bar component', () => {
        // Create initial element
        const element = createElement('c-api-property', {
            is: ApiProperty,
        });
        document.body.appendChild(element);

        // Query lightning-input element
        const lightningInputEl = element.shadowRoot.querySelector(
            'lightning-input',
        );
        expect(lightningInputEl).not.toBeNull();
        expect(lightningInputEl.label).toBe('Percentage');

        // Query chart-bar component
        const chartBarEl = element.shadowRoot.querySelector('c-chart-bar');
        expect(chartBarEl).not.toBeNull();

        // Validation for default value passed down to child component
        expect(chartBarEl.percentage).toBe(50);
    });

    it('changes the value of the c-chart-bar child component based on user input', () => {
        // Create initial element
        const element = createElement('c-api-property', {
            is: ApiProperty,
        });
        document.body.appendChild(element);
        const lightningInputEl = element.shadowRoot.querySelector(
            'lightning-input',
        );
        lightningInputEl.value = 40;
        lightningInputEl.dispatchEvent(new CustomEvent('change'));

        // Query chart-bar component
        const chartBarEl = element.shadowRoot.querySelector('c-chart-bar');

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise ends in the
        // rejected state
        return Promise.resolve()
            .then(() => {
                // Query newly set public property on chart-bar component
                expect(chartBarEl.percentage).toBe(40);
                // Set new public property value on chart-bar component
                lightningInputEl.value = 60;
                lightningInputEl.dispatchEvent(new CustomEvent('change'));
            })
            .then(() => {
                // Query newly set public property on chart-bar component
                expect(chartBarEl.percentage).toBe(60);
            })
            .then(() => {
                // Checking the min/max values of the lightning-input component
                lightningInputEl.value = 101;
                expect(lightningInputEl.validity).toBeFalsy();
                lightningInputEl.value = -1;
                expect(lightningInputEl.validity).toBeFalsy();
            });
    });
});
