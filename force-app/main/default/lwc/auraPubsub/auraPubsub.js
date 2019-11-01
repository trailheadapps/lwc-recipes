/**
 * A Lightning Web component that wraps the methods of the pubsub ES6 module.
 * This utility component allows Aura components to exchange messages (events) with Lightning web components.
 * You can import an ES6 module directly into an Aura component, but in this case, we need to get the current page reference.
 * You can't get the current page reference in an ES6 module; you must use a Lightning web component.
 * Usage: add this component to an Aura component to publish events or subscribe to events using the pubsub utility.
 * Do NOT use this component inside Lightning web components where you can import the pubsub module directly.
 * The pubsub approach is used to provide a communication mechanism between sibling components assembled in a flexipage (App Builder) where traditional parent/child communication patterns are not available.
 * Do NOT use this utility for parent/child communication.
 */
import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import {
    registerListener,
    unregisterListener,
    unregisterAllListeners,
    fireEvent
} from 'c/pubsub';

export default class AuraPubsub extends LightningElement {
    @wire(CurrentPageReference) pageRef;

    connectedCallback() {
        this.dispatchEvent(new CustomEvent('ready'));
    }

    @api
    registerListener(eventName, callback) {
        registerListener(eventName, callback, this);
    }

    @api
    unregisterListener(eventName, callback) {
        unregisterListener(eventName, callback, this);
    }

    @api
    unregisterAllListeners() {
        unregisterAllListeners(this);
    }

    @api
    fireEvent(eventName, data) {
        fireEvent(this.pageRef, eventName, data);
    }
}
