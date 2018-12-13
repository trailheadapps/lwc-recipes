import { LightningElement } from 'lwc';
import Id from '@salesforce/user/Id';

export default class MiscGetUserId extends LightningElement {
    // Reassigning Id to a component property to provide access in the template.
    // Since the user id doesn't change within a session, no need to @track it.
    userId = Id;
}
