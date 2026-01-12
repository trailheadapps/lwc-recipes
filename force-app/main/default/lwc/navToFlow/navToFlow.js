import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import LightningAlert from 'lightning/alert';

export default class NavToFlow extends NavigationMixin(LightningElement) {
    flowDevName = 'SimpleGreetingFlow';

    /**
     * Navigate to a flow using the standard__flow PageReference type
     * This is a new Spring '26 feature!
     */
    navigateToFlow() {
        this[NavigationMixin.Navigate]({
            type: 'standard__flow',
            attributes: {
                devName: this.flowDevName
            }
        });
    }

    /**
     * Navigate to flow with input variables
     * Input variables must be prefixed with 'flow__'
     */
    navigateToFlowWithInput() {
        this[NavigationMixin.Navigate]({
            type: 'standard__flow',
            attributes: {
                devName: this.flowDevName
            },
            state: {
                flow__userName: 'Trailblazer'
            }
        });
    }

    /**
     * Generate a URL to the flow (useful for anchor tags or sharing)
     */
    async generateFlowUrl() {
        const url = await this[NavigationMixin.GenerateUrl]({
            type: 'standard__flow',
            attributes: {
                devName: this.flowDevName
            }
        });

        // Display the generated URL using LightningAlert
        await LightningAlert.open({
            message: url,
            theme: 'info',
            label: 'Generated Flow URL'
        });
    }
}
