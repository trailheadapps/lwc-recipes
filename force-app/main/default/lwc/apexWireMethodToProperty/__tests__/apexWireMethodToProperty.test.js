import { createElement } from 'lwc';
import ApexWireMethodToProperty from 'c/apexWireMethodToProperty';
import { registerApexTestWireAdapter } from '@salesforce/lwc-jest';
import getContactList from '@salesforce/apex/ContactController.getContactList';

// Realistic data with a list of contacts
const mockGetContactList = require('./data/getContactList.json');
// An empty list of records to verify the component does something reasonable
// when there is no data to display
const mockGetContactListNoRecords = require('./data/getContactListNoRecords.json');

// Register as an Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const getContactListAdapter = registerApexTestWireAdapter(getContactList);

describe('c-apex-wire-method-to-property', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    describe('getContactList @wire data', () => {
        it('with six records', () => {
            const element = createElement('c-apex-wire-method-to-property', {
                is: ApexWireMethodToProperty
            });
            document.body.appendChild(element);
            getContactListAdapter.emit(mockGetContactList);
            return Promise.resolve().then(() => {
                const detailEls = element.shadowRoot.querySelectorAll('p');
                expect(detailEls.length).toBe(mockGetContactList.length);
                expect(detailEls[0].textContent).toBe(
                    mockGetContactList[0].Name
                );
            });
        });

        it('with no record', () => {
            const element = createElement('c-apex-wire-method-to-property', {
                is: ApexWireMethodToProperty
            });
            document.body.appendChild(element);
            getContactListAdapter.emit(mockGetContactListNoRecords);
            return Promise.resolve().then(() => {
                const detailEls = element.shadowRoot.querySelectorAll('p');
                expect(detailEls.length).toBe(
                    mockGetContactListNoRecords.length
                );
            });
        });
    });

    describe('getContactList @wire error', () => {
        it('shows error panel element', () => {
            const element = createElement('c-apex-wire-method-to-property', {
                is: ApexWireMethodToProperty
            });
            document.body.appendChild(element);
            getContactListAdapter.error();
            return Promise.resolve().then(() => {
                const errorPanelEl = element.shadowRoot.querySelector(
                    'c-error-panel'
                );
                expect(errorPanelEl).not.toBeNull();
            });
        });
    });
});
