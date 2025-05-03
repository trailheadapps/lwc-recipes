import { LightningElement } from 'lwc';

// import the permission from userPermission (standard Salesforce permissions) or
// customPermission (custom org-defined permissions)
import hasAccessRestrictedUI from '@salesforce/customPermission/accessRestrictedUIPermission';

export default class MiscPermissionBasedUI extends LightningElement {
    // surface imported permission to HTML template with getter
    get isRestrictedUIAccessible() {
        return hasAccessRestrictedUI;
    }
}
