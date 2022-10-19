import { createElement } from 'lwc';
import LmsPublisherWebComponent from 'c/lmsPublisherWebComponent';
import { publish } from 'lightning/messageService';
import RECORD_SELECTED_CHANNEL from '@salesforce/messageChannel/Record_Selected__c';

import getContactList from '@salesforce/apex/ContactController.getContactList';

// Realistic data with a list of contacts
const mockGetContactList = require('./data/getContactList.json');

// Mock getContactList Apex wire adapter
jest.mock(
    '@salesforce/apex/ContactController.getContactList',
    () => {
        const {
            createApexTestWireAdapter
        } = require('@salesforce/sfdx-lwc-jest');
        return {
            default: createApexTestWireAdapter(jest.fn())
        };
    },
    { virtual: true }
);

describe('c-lms-publisher-web-component', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.
    async function flushPromises() {
        return Promise.resolve();
    }

    describe('getContactList @wire', () => {
        it('renders data of one record when it is returned', async () => {
            // Create initial element
            const element = createElement('c-lms-publisher-web-component', {
                is: LmsPublisherWebComponent
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getContactList.emit(mockGetContactList);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Select elements for validation
            const detailEls = element.shadowRoot.querySelectorAll(
                'c-contact-list-item-bubbling'
            );
            expect(detailEls.length).toBe(mockGetContactList.length);
        });
    });

    it('calls publish based on an event from a child c-contact-list-item-bubbling component', async () => {
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
        getContactList.emit(mockGetContactList);

        // Wait for any asynchronous DOM updates
        await flushPromises();

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

    it('is accessible when data is returned', async () => {
        // Create initial element
        const element = createElement('c-lms-publisher-web-component', {
            is: LmsPublisherWebComponent
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getContactList.emit(mockGetContactList);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });
});
