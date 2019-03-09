import { createElement } from 'lwc';
import LibsMomentjs from 'c/libsMomentjs';

jest.mock(
    'lightning/platformResourceLoader',
    () => {
        return {
            loadScript() {
                // eslint-disable-next-line no-unused-vars
                return new Promise((resolve, reject) => {
                    global.moment = require('../../../staticresources/moment');
                    resolve();
                });
            }
        };
    },
    { virtual: true }
);

describe('c-libs-momentjs', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('populates the disabled lightning-input fields with moment.js data based on user input', () => {
        const OUTPUT_RAW = '2019-03-11T22:30:00.000Z';
        const OUTPUT_DAY_OF_YEAR = 70;
        const OUTPUT_WEEK_OF_YEAR = 11;
        const OUTPUT_CALCULATED = 'Today at 8:57 AM';

        // Create initial element
        const element = createElement('c-libs-momentjs', {
            is: LibsMomentjs
        });
        document.body.appendChild(element);

        // Selecting the input element for simulating user input
        const inputEl = element.shadowRoot.querySelector('lightning-input');
        inputEl.value = new Date(OUTPUT_RAW);
        inputEl.dispatchEvent(new CustomEvent('change'));

        return Promise.resolve().then(() => {
            const inputEls = element.shadowRoot.querySelectorAll(
                'lightning-input'
            );
            expect(inputEls[2].value).toBe(OUTPUT_DAY_OF_YEAR);
            expect(inputEls[3].value).toBe(OUTPUT_WEEK_OF_YEAR);
            expect(inputEls[4].value).toBe(OUTPUT_CALCULATED);
        });
    });

    // TODO: Add error handling for toast
});
