import { createElement } from 'lwc';
import LmsPublisherWebComponent from 'c/lmsPublisherWebComponent';
import { publish, MessageContext } from 'lightning/messageService';
import RECORD_SELECTED_CHANNEL from '@salesforce/messageChannel/Record_Selected__c';

import {
    registerApexTestWireAdapter,
    registerTestWireAdapter
} from '@salesforce/sfdx-lwc-jest';
import getContactList from '@salesforce/apex/ContactController.getContactList';

// Realistic data with a list of contacts
const mockGetContactList = require('./data/getContactList.json');

// An empty list of records to verify the component does something reasonable
// when there is no data to display
const mockGetContactListNoRecords = require('./data/getContactListNoRecords.json');

// Register as Apex wire adapter. Some tests verify that data is retrieved.
const getContactListAdapter = registerApexTestWireAdapter(getContactList);

// Register as a standard wire adapter because the component under test requires this adapter.
// We don't exercise this wire adapter in the tests.
registerTestWireAdapter(MessageContext);

describe('c-lms-publisher-web-component', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    describe('getContactList @wire data', () => {
        it('renders data of one record', () => {
            // Create initial element
            const element = createElement('c-lms-publisher-web-component', {
                is: LmsPublisherWebComponent
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getContactListAdapter.emit(mockGetContactList);
            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                // Select elements for validation
                const detailEls = element.shadowRoot.querySelectorAll(
                    'c-contact-list-item-bubbling'
                );
                expect(detailEls.length).toBe(mockGetContactList.length);
            });
        });

        it('renders with no record', () => {
            // Create initial element
            const element = createElement('c-lms-publisher-web-component', {
                is: LmsPublisherWebComponent
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getContactListAdapter.emit(mockGetContactListNoRecords);
            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                // Select elements for validation
                const detailEls = element.shadowRoot.querySelectorAll(
                    'c-contact-list-item-bubbling'
                );
                expect(detailEls.length).toBe(
                    mockGetContactListNoRecords.length
                );
            });
        });
    });

    it('calls publish based on an event from a child c-contact-list-item-bubbling component', () => {
        const CONTACT = {
            Id: '0031700000pJRRSAA4',
            Name: 'Amy Taylor',
            Title: 'VP of Engineering',
            Phone: '4152568563',
            Email: 'amy@demo.net',
            Picture__c:
                'https://s3-us-west-1.amazonaws.com/sfdc-demo/people/amy_taylor.jpg'
        };

        const PAYLOAD = { recordId: CONTACT.Id };

        // Create initial element
        const element = createElement('c-lms-publisher-web-component', {
            is: LmsPublisherWebComponent
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getContactListAdapter.emit(mockGetContactList);
        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            const detailEl = element.shadowRoot.querySelector(
                'c-contact-list-item-bubbling'
            );
            // Dispatch new event on child component to validate if it triggers
            // a publish call in the current component.
            detailEl.dispatchEvent(
                new CustomEvent('contactselect', {
                    detail: CONTACT,
                    bubbles: true
                })
            );

            // Was publish called and was it called with the correct params?
            expect(publish).toHaveBeenCalledWith(
                undefined,
                RECORD_SELECTED_CHANNEL,
                PAYLOAD
            );
        });
    });
});
