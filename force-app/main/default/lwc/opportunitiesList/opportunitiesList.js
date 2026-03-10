import { fromContext } from '@lwc/state';
import currency from '@salesforce/i18n/currency';
import opportunitiesStateManager from 'c/opportunitiesStateManager';
import { LightningElement } from 'lwc';

export default class OpportunitiesList extends LightningElement {
    stateManager = fromContext(opportunitiesStateManager);

    columns = [
        { label: 'Name', fieldName: 'name' },
        { label: 'Stage', fieldName: 'stage' },
        {
            label: 'Amount',
            fieldName: 'amount',
            type: 'currency',
            typeAttributes: { currencyCode: currency }
        }
    ];

    get data() {
        return this.stateManager.value.opportunities.map((oppty) => ({
            id: oppty.Id,
            name: oppty.Name.value,
            stage: oppty.StageName.value,
            amount: oppty.Amount.value
        }));
    }
}
