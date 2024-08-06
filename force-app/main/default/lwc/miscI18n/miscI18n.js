import { LightningElement } from 'lwc';
import USER_LOCALE from '@salesforce/i18n/locale';
import USER_CURRENCY from '@salesforce/i18n/currency';

export default class I18n extends LightningElement {
    userLocale = USER_LOCALE;
    userCurrency = USER_CURRENCY;
    japanLocale = 'ja-JP';
    japanCurrency = 'JPY';

    get dateUserLocale() {
        const date = new Date();
        return new Intl.DateTimeFormat(USER_LOCALE).format(date);
    }

    get dateJapanLocale() {
        const date = new Date();
        return new Intl.DateTimeFormat(this.japanLocale).format(date);
    }

    get currencyUserLocale() {
        return new Intl.NumberFormat(USER_LOCALE, {
            style: 'currency',
            currency: USER_CURRENCY,
            currencyDisplay: 'symbol'
        }).format(100);
    }

    get currencyJapanLocale() {
        return new Intl.NumberFormat(this.japanLocale, {
            style: 'currency',
            currency: this.japanCurrency,
            currencyDisplay: 'symbol'
        }).format(100);
    }
}
