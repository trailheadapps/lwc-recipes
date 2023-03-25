import { LightningElement, wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContactList';

const COLS = [
    { label: 'First Name', fieldName: 'FirstName' },
    { label: 'Last Name', fieldName: 'LastName' },
    { label: 'Title', fieldName: 'Title' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Email', fieldName: 'Email', type: 'email' },
    {
        label: 'Contact Picture',
        type: 'customPictureType',
        typeAttributes: {
            pictureUrl: { fieldName: 'Picture__c' }
        },
        cellAttributes: { alignment: 'center' }
    }
];
export default class DatatableCustomDataType extends LightningElement {
    columns = COLS;

    @wire(getContacts)
    contacts;
}
