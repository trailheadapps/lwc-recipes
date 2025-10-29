import { createElement } from '@lwc/engine-dom';
import MiscSharedJavaScript from 'c/miscSharedJavaScript';
import { calculateMonthlyPayment } from 'c/mortgage';

// Mocking mortgage module
jest.mock('c/mortgage', () => {
    return {
        getTermOptions: jest.fn(),
        calculateMonthlyPayment: jest.fn()
    };
});

// Default values for mortgage calculation
const PRINCIPAL_DEFAULT = 200000;
const TERM_DEFAULT = 30;
const RATE_DEFAULT = 4;

// Custom values for mortgate calculation
const PRINCIPAL_CUSTOM = 100000;
const TERM_CUSTOM = 15;
const RATE_CUSTOM = 2;

describe('c-misc-shared-java-script', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Clear mocks so that every test run has a clean implementation
        jest.clearAllMocks();
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.
    async function flushPromises() {
        return Promise.resolve();
    }
    it('calculates mortgage with default values', async () => {
        // Create component
        const element = createElement('c-misc-shared-java-script', {
            is: MiscSharedJavaScript
        });
        document.body.appendChild(element);

        // Click button
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check if default values for principal, term, and rate are used for mortgage calculcation
        expect(calculateMonthlyPayment).toHaveBeenCalledWith(
            PRINCIPAL_DEFAULT,
            TERM_DEFAULT,
            RATE_DEFAULT
        );
    });

    it('calculates mortgage with custom values', async () => {
        // Create component
        const element = createElement('c-misc-shared-java-script', {
            is: MiscSharedJavaScript
        });
        document.body.appendChild(element);

        // Select input fields for simulating user input
        const lightningInputEls =
            element.shadowRoot.querySelectorAll('lightning-input');

        lightningInputEls.forEach((el) => {
            if (el.label === 'Rate') {
                el.value = RATE_CUSTOM;
            } else if (el.label === 'Principal') {
                el.value = PRINCIPAL_CUSTOM;
            }
            el.dispatchEvent(new CustomEvent('change'));
        });

        // Select combobox for simulating user input
        const lightningComboboxEl =
            element.shadowRoot.querySelector('lightning-combobox');
        lightningComboboxEl.value = TERM_CUSTOM;
        lightningComboboxEl.dispatchEvent(new CustomEvent('change'));

        // Click button
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check if default values for principal, term, and rate are used for mortgage calculcation
        expect(calculateMonthlyPayment).toHaveBeenCalledWith(
            PRINCIPAL_CUSTOM,
            TERM_CUSTOM,
            RATE_CUSTOM
        );
    });

    it('is accessible', async () => {
        const element = createElement('c-misc-shared-java-script', {
            is: MiscSharedJavaScript
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
