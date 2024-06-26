import { LightningElement } from 'lwc';
import USER_LOCALE from '@salesforce/i18n/locale';
import USER_CURRENCY from '@salesforce/i18n/currency';

export default class Egei18n extends LightningElement {
    anotherLocale = 'ja-JP';

    get today() {
        const date = new Date();
        return new Intl.DateTimeFormat(USER_LOCALE).format(date);
    }

    get todayOtherUser() {
        const date = new Date();
        return new Intl.DateTimeFormat(this.anotherLocale).format(date);
    }

    get hundredLocaleCurrency() {
        return new Intl.NumberFormat(USER_LOCALE, {
            style: 'currency',
            currency: USER_CURRENCY,
            currencyDisplay: 'symbol'
        }).format(100);
    }

    get hundredOtherUserCurrency() {
        return new Intl.NumberFormat(this.anotherLocale, {
            style: 'currency',
            currency: USER_CURRENCY,
            currencyDisplay: 'symbol'
        }).format(100);
    }
}
