import { LightningElement, track } from 'lwc';

export default class CalcTest extends LightningElement {
    orgSetup = 0; 
    userSetup = 0;
    securityAccess = 0;
    stdCustomObjects = 0;
    salesMarketingApps = 0;
    serviceSupportApps = 0;
    activityMgtColab = 0;
    dataMgt = 0;
    reportsDashboards = 0;
    workflowProcessAut = 0;
    desktopMobileAdmin = 0;
    appExchange = 0;
    
    @track result = 0;

    handleChanges(event) {
        if (event.target.name === 'orgSetup') {
            this.orgSetup = event.target.value;
        }
        if (event.target.name === 'userSetup') {
            this.userSetup = event.target.value;
        }
        if (event.target.name === 'securityAccess') {
            this.securityAccess = event.target.value;
        }
        if (event.target.name === 'stdCustomObjects') {
            this.stdCustomObjects = event.target.value;
        }
        if (event.target.name === 'salesMarketingApps') {
            this.salesMarketingApps = event.target.value;
        }
        if (event.target.name === 'serviceSupportApps') {
            this.serviceSupportApps = event.target.value;
        }
        if (event.target.name === 'activityMgtColab') {
            this.activityMgtColab = event.target.value;
        }
        if (event.target.name === 'dataMgt') {
            this.dataMgt = event.target.value;
        }
        if (event.target.name === 'reportsDashboards') {
            this.reportsDashboards = event.target.value;
        }
        if (event.target.name === 'workflowProcessAut') {
            this.workflowProcessAut = event.target.value;
        }
        if (event.target.name === 'desktopMobileAdmin') {
            this.desktopMobileAdmin = event.target.value;
        }
        if (event.target.name === 'appExchange') {
            this.appExchange = event.target.value;
        } 

        this.result = 0.03 * parseInt(this.orgSetup) + 0.06 * parseInt(this.userSetup) + 0.14 * parseInt(this.securityAccess) + 0.15 * parseInt(this.stdCustomObjects) + 0.15 * parseInt(this.salesMarketingApps) + 0.12 * parseInt(this.serviceSupportApps) + 0.03 * parseInt(this.activityMgtColab) + 0.08 * parseInt(this.dataMgt) + 0.1 * parseInt(this.reportsDashboards) + 0.12 * parseInt(this.workflowProcessAut) + 0.01 * parseInt(this.desktopMobileAdmin) + 0.01 * parseInt(this.appExchange);
    }
}