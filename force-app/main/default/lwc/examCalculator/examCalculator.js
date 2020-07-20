import {LightningElement, track} from 'lwc';
import saveResultToBD from '@salesforce/apex/examCalculatorController.saveResult';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class ExamCalculator extends LightningElement {
    salesforceFundamentals = 0;
    salesforceFundamentalsPercentage = 0;
    dataModelingAndManagement = 0;
    dataModelingAndManagementPercentage = 0;
    userInterface = 0;
    userInterfacePercentage = 0;
    processAutomationAndLogic = 0;
    processAutomationAndLogicPercentage = 0;
    testingDebuggingAndDeployment = 0;
    testingDebuggingAndDeploymentPercentage = 0;
    @track result = 0;
    @track scoreRecordUrl = '';
    saveScore(event) {
        saveResultToBD({params : {'score' : this.result}})
            .then((resultTotal) => {
                console.log(resultTotal)
                const evt = new ShowToastEvent({
                    title: 'Success',
                    message: 'Score successfully saved',
                    variant: 'success',
                    mode: 'dismissable'
                });
                this.dispatchEvent(evt);
                this.scoreRecordUrl = '/' + resultTotal.scoreId
                window.setTimeout(
                    () => {
                        window.open(this.scoreRecordUrl, '_blank');
                    },
                    1500
                )
            })
            .catch((error) => {
                this.message = 'Error received: code' + error.errorCode + ', ' +
                    'message ' + error.body.message;
            });
    }
    handleChanges(event){
        if (event.target.name === 'salesforceFundamentals') {
            this.salesforceFundamentals = event.target.value;
            this.salesforceFundamentalsPercentage = event.target.value;
        }
        if (event.target.name === 'dataModelingAndManagement') {
            this.dataModelingAndManagement = event.target.value;
            this.dataModelingAndManagementPercentage = event.target.value;
        }
        if (event.target.name === 'processAutomationAndLogic') {
            this.processAutomationAndLogic = event.target.value;
            this.processAutomationAndLogicPercentage = event.target.value;
        }
        if (event.target.name === 'userInterface') {
            this.userInterface = event.target.value;
            this.userInterfacePercentage = event.target.value;
        }
        if (event.target.name === 'testingDebuggingAndDeployment') {
            this.testingDebuggingAndDeployment = event.target.value;
            this.testingDebuggingAndDeploymentPercentage = event.target.value;
        }
        this.result = parseInt(parseInt(this.salesforceFundamentals * 7)/100 +
            parseInt(this.dataModelingAndManagement * 13) / 100 +
            parseInt(this.processAutomationAndLogic * 38) / 100 +
            parseInt(this.userInterface * 25) / 100 +
            parseInt(this.testingDebuggingAndDeployment * 17) / 100);
    }
}