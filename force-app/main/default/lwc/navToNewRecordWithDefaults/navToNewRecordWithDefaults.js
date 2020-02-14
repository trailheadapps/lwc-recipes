import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
// currently the below import is not supported with sfdx-lwc-jest v0.7.0
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';

export default class NavToNewRecord extends NavigationMixin(LightningElement) {
    navigateToNewContactWithDefaults() {
        const defaultValues = encodeDefaultFieldValues({
            FirstName: 'Morag',
            LastName: 'de Fault',
            LeadSource: 'Other'
        });

        // eslint-disable-next-line no-console
        console.log(defaultValues);

        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Contact',
                actionName: 'new'
            },
            state: {
                defaultFieldValues: defaultValues
            }
        });
    }
}
