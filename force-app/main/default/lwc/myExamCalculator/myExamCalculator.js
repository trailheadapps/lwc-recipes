import {LightningElement, track} from 'lwc';
export default class myExamCalculator extends LightningElement {
    orgSetup = 0;
    userSetup = 0;
    securityAndAccess = 0;
    standardAndCustomObjects = 0;
    salesAndMarketingApps = 0;
    salesAndSupportApps = 0;
    activityManagementAndCollaboration = 0;
    dataManagement = 0;
    analyticsReportsAndDashboards = 0;
    workflowAndProcessAutomation = 0;
    desktopAndMobileAdmin = 0;
    appexchange = 0;
    salesforceFundamentals = 0;
    dataModelingAndManagement = 0;
    security = 0;
    automation = 0;
    social = 0;
    userInterface = 0;
    reporting = 0;
    mobile = 0;
    appDeployment = 0;
    salesforceFundamentals = 0;
    dataModelingAndManagement = 0;
    processAutomationAndLogic = 0;
    userInterface = 0;
    testingDebuggingAndDeployment = 0;
    @track result1 = 0;
    @track result2= 0;
    @track result3 = 0;
    handleChanges1(event) {
        if (event.target.name === '1') {
            this.orgSetup = event.target.value;
        }
        if (event.target.name === '2') {
            this.userSetup = event.target.value;
        }
        if (event.target.name === '3') {
            this.securityAndAccess = event.target.value;
        }
        if (event.target.name === '4') {
            this.standardAndCustomObjects = event.target.value;
        }
        if (event.target.name === '5') {
            this.salesAndMarketingApps = event.target.value;
        }
        if (event.target.name === '6') {
            this.salesAndSupportApps = event.target.value;
        }
        if (event.target.name === '7') {
            this.activityManagementAndCollaboration = event.target.value;
        }
        if (event.target.name === '8') {
            this.dataManagement = event.target.value;
        }
        if (event.target.name === '9') {
            this.analyticsReportsAndDashboards = event.target.value;
        }
        if (event.target.name === '10') {
            this.workflowAndProcessAutomation = event.target.value;
        }
        if (event.target.name === '11') {
            this.desktopAndMobileAdmin = event.target.value;
        }
        if (event.target.name === '12') {
            this.appexchange = event.target.value;
        }
            this.result1 = parseInt(parseInt(this.orgSetup * 3) / 100 +
                parseInt(this.userSetup * 6) / 100 +
                parseInt(this.securityAndAccess * 14) / 100 +
                parseInt(this.standardAndCustomObjects * 15) / 100 +
                parseInt(this.salesAndMarketingApps * 15) / 100 +
                parseInt(this.salesAndSupportApps * 12) / 100 +
                parseInt(this.activityManagementAndCollaboration * 3) / 100 +
                parseInt(this.dataManagement * 8) / 100 +
                parseInt(this.analyticsReportsAndDashboards * 10) / 100 +
                parseInt(this.workflowAndProcessAutomation * 12) / 100 +
                parseInt(this.desktopAndMobileAdmin * 1) / 100 +
                parseInt(this.appexchange * 1) / 100);
        }
        handleChanges2(event) {
        if (event.target.name === 'first1') {
        this.salesforceFundamentals = event.target.value;
    }
    if (event.target.name === 'second2') {
        this.dataModelingAndManagemen = event.target.value;
    }
    if (event.target.name === 'third3') {
        this.security = event.target.value;
    }
    if (event.target.name === 'fourth4') {
        this.automation = event.target.value;
    }
    if (event.target.name === 'fifth5') {
        this.social = event.target.value;
    }
    if (event.target.name === 'sixth6') {
        this.userInterface = event.target.value;
    }
    if (event.target.name === 'seventh7') {
        this.reporting = event.target.value;
    }
    if (event.target.name === 'eighth8') {
        this.mobile = event.target.value;
    }
    if (event.target.name === 'nineth9') {
        this.appDeployment = event.target.value;
    }
            this.result2 = parseInt(parseInt(this.salesforceFundamentals * 8)/100 +
        parseInt(this.dataModelingAndManagement * 20) /100 +
        parseInt(this.security * 10) /100 +
        parseInt(this.automation * 27)/100 +
        parseInt(this.social*3)/100 +
        parseInt(this.userInterface*14)/100 +
        parseInt(this.reporting*5)/100 +
        parseInt(this.mobile*5)/100 +
        parseInt(this.appDeployment*8)/100);
}
            handleChanges3(event){
        if (event.target.name === 'first') {
            this.salesforceFundamentals = event.target.value;
        }
        if (event.target.name === 'second') {
            this.dataModelingAndManagement = event.target.value;
        }
        if (event.target.name === 'third') {
            this.processAutomationAndLogic = event.target.value;
        }
        if (event.target.name === 'fourth') {
            this.userInterface = event.target.value;
        }
        if (event.target.name === 'fifth') {
            this.testingDebuggingAndDeployment = event.target.value;
        }
            this.result3 = parseInt(parseInt(this.salesforceFundamentals * 7)/100 +
            parseInt(this.dataModelingAndManagement * 13) / 100 +
            parseInt(this.processAutomationAndLogic * 38) / 100 +
            parseInt(this.userInterface * 25) / 100 +
            parseInt(this.testingDebuggingAndDeployment * 17) / 100);
    }
}