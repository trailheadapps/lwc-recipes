import { createElement } from 'lwc';
import MiscI18n from 'c/miscI18n';
import USER_LOCALE from '@salesforce/i18n/locale';
import USER_CURRENCY from '@salesforce/i18n/currency';

describe('c-misc-i18n', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('component is initialized with correct variables', () => {
        // Create initial element
        const element = createElement('c-misc-i18n', {
            is: MiscI18n
        });
        document.body.appendChild(element);

        const userLocale = element.shadowRoot.querySelector('span.userLocale');
        expect(userLocale).not.toBeNull();
        expect(userLocale.textContent).toBe(USER_LOCALE);

        const dateUserLocale = element.shadowRoot.querySelector(
            'span.dateUserLocale'
        );
        expect(dateUserLocale).not.toBeNull();
        expect(dateUserLocale.textContent).toBe(
            new Intl.DateTimeFormat(USER_LOCALE).format(new Date())
        );

        const currencyUserLocale = element.shadowRoot.querySelector(
            'span.currencyUserLocale'
        );
        expect(currencyUserLocale).not.toBeNull();
        expect(currencyUserLocale.textContent).toBe(
            new Intl.NumberFormat(USER_LOCALE, {
                style: 'currency',
                currency: USER_CURRENCY,
                currencyDisplay: 'symbol'
            }).format(100)
        );

        const dateJapanLocale = element.shadowRoot.querySelector(
            'span.dateJapanLocale'
        );
        expect(dateJapanLocale).not.toBeNull();
        expect(dateJapanLocale.textContent).toBe(
            new Intl.DateTimeFormat('ja-JP').format(new Date())
        );

        const currencyJapanLocale = element.shadowRoot.querySelector(
            'span.currencyJapanLocale'
        );
        expect(currencyJapanLocale).not.toBeNull();
        expect(currencyJapanLocale.textContent).toBe(
            new Intl.NumberFormat('ja-JP', {
                style: 'currency',
                currency: 'JPY',
                currencyDisplay: 'symbol'
            }).format(100)
        );
    });

    it('is accessible', async () => {
        const element = createElement('c-misc-i18n', {
            is: MiscI18n
        });

        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });
});
