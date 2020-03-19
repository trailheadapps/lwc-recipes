import { LightningElement, wire } from 'lwc';
import { /*subscribe,*/ MessageContext } from 'lightning/messageService';
//import recordSelected from '@salesforce/messageChannel/RecordSelected__c';

export default class LmsSubscriberWebComponent extends LightningElement {
    contacts = [];

    @wire(MessageContext)
    messageContext;
}
