/**
 * The pubsub communication approach is used to provide a communication mechanism between sibling components assembled in a flexipage (App Builder) where traditional parent/child communication patterns are not available.
 * Do NOT use this utility for parent/child communication. Use the guidelines below instead.
 * For child-to-parent communication, fire a DOM event in the child component
 * For parent-to-child communication, use property passing or call a public @api method defined in the child component
 */
import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import findContacts from '@salesforce/apex/ContactController.findContacts';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';

export default class PubsubContactList extends LightningElement {
    searchKey;

    @wire(CurrentPageReference) pageRef;

    @wire(findContacts, { searchKey: '$searchKey' })
    contacts;

    connectedCallback() {
        // subscribe to searchKeyChange event
        registerListener('searchKeyChange', this.handleSearchKeyChange, this);
    }

    disconnectedCallback() {
        // unsubscribe from searchKeyChange event
        unregisterAllListeners(this);
    }

    handleSearchKeyChange(searchKey) {
        this.searchKey = searchKey;
    }

    handleContactSelect(event) {
        // fire contactSelected event
        fireEvent(this.pageRef, 'contactSelected', event.target.contact.Id);
    }
}
