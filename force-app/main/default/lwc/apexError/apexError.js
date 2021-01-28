import { LightningElement, wire } from 'lwc';
import getContactError from '@salesforce/apex/ContactController.getContactError';

export default class ApexError extends LightningElement {
    @wire(getContactError) contact;
}
