import { fromContext } from '@lwc/state';
import currency from '@salesforce/i18n/currency';
import opportunitiesStateManager from 'c/opportunitiesStateManager';
import { LightningElement } from 'lwc';

export default class OpportunitiesSummary extends LightningElement {
    stateManager = fromContext(opportunitiesStateManager);
    orgCurrency = currency;

    get count() {
        return this.stateManager.value.opportunities.length;
    }
}
