import { LightningElement, track } from 'lwc';

export default class CalcTest extends LightningElement {
    sfFundamentals = 0; 
    dataModeling = 0;
    security = 0;
    automation = 0;
    social = 0;
    userInterface = 0;
    reporting = 0;
    mobile = 0;
    appDeployment = 0;
    
    @track result = 0;

    handleChanges(event) {
        if (event.target.name === 'sfFundamentals') {
            this.sfFundamentals = event.target.value;
        }
        if (event.target.name === 'dataModeling') {
            this.dataModeling = event.target.value;
        }
        if (event.target.name === 'security') {
            this.security = event.target.value;
        }
        if (event.target.name === 'automation') {
            this.automation = event.target.value;
        }
        if (event.target.name === 'social') {
            this.social = event.target.value;
        }
        if (event.target.name === 'userInterface') {
            this.userInterface = event.target.value;
        }
        if (event.target.name === 'reporting') {
            this.reporting = event.target.value;
        }
        if (event.target.name === 'mobile') {
            this.mobile = event.target.value;
        }
        if (event.target.name === 'appDeployment') {
            this.appDeployment = event.target.value;
        }

        this.result = 0.08 * parseInt(this.sfFundamentals) + 0.2 * parseInt(this.dataModeling) + 0.1 * parseInt(this.security) + 0.27 * parseInt(this.automation) + 0.03 * parseInt(this.social) + 0.14 * parseInt(this.userInterface) + 0.05 * parseInt(this.reporting) + 0.05 * parseInt(this.mobile) + 0.08 * parseInt(this.appDeployment);
        
    }
}