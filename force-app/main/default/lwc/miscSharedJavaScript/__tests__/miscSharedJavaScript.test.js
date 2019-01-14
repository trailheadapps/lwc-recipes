import { createElement } from 'lwc';
import MiscSharedJavaScript from 'c/miscSharedJavaScript';
import { calculateMonthlyPayment } from 'c/mortgage';

jest.mock('c/mortgage', () => {
    return {
        getTermOptions: jest.fn(),
        calculateMonthlyPayment: jest.fn()
    };
});

// Default values for mortgage calculation
const principalDefault = 200000;
const termDefault = 30;
const rateDefault = 4;

// Custom values for mortgate calculation
const principalCustom = 100000;
const termCustom = 15;
const rateCustom = 2;

describe('c-misc-shared-java-script', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Clear mocks so that every test run has a clean implementation
        jest.clearAllMocks();
    });

    it('calculates mortgage with default values', () => {
        // Create initial element
        const element = createElement('c-misc-shared-java-script', {
            is: MiscSharedJavaScript
        });
        document.body.appendChild(element);

        const lightningButtonEl = element.shadowRoot.querySelector(
            'lightning-button'
        );
        lightningButtonEl.dispatchEvent(new CustomEvent('click'));

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise ends in the
        // rejected state
        return Promise.resolve().then(() => {
            // Check if default values for principal, term, and rate are used for mortgage calculcation
            expect(calculateMonthlyPayment).toHaveBeenCalledWith(
                principalDefault,
                termDefault,
                rateDefault
            );
        });
    });

    it('calculates mortgage with custom values', () => {
        // Create initial element
        const element = createElement('c-misc-shared-java-script', {
            is: MiscSharedJavaScript
        });
        document.body.appendChild(element);

        const lightningInputEls = element.shadowRoot.querySelectorAll(
            'lightning-input'
        );

        lightningInputEls.forEach(el => {
            if (el.label === 'Rate') {
                el.value = rateCustom;
            } else if (el.label === 'Principal') {
                el.value = principalCustom;
            }
            el.dispatchEvent(new CustomEvent('change'));
        });

        const lightningComboboxEl = element.shadowRoot.querySelector(
            'lightning-combobox'
        );
        lightningComboboxEl.value = termCustom;
        lightningComboboxEl.dispatchEvent(new CustomEvent('change'));

        const lightningButtonEl = element.shadowRoot.querySelector(
            'lightning-button'
        );
        lightningButtonEl.dispatchEvent(new CustomEvent('click'));

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise ends in the
        // rejected state
        return Promise.resolve().then(() => {
            // Check if default values for principal, term, and rate are used for mortgage calculcation
            expect(calculateMonthlyPayment).toHaveBeenCalledWith(
                principalCustom,
                termCustom,
                rateCustom
            );
        });
    });
});
