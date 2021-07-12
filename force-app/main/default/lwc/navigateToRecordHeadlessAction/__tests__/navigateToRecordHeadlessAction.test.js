import { createElement } from 'lwc';
import NavigateToRecordHeadlessAction from '../navigateToRecordHeadlessAction';
import { getNavigateCalledWith } from 'lightning/navigation';

describe('c-navigate-to-record--headless-action', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });
    it('Test Navigation', () => {
        // Create initial element
        const element = createElement('c-navigate-to-record-action', {
            is: NavigateToRecordHeadlessAction
        });
        document.body.appendChild(element);
        //Call invoke()
        element.invoke();
        const { pageReference } = getNavigateCalledWith();
        // Assert pageReference values.
        expect(pageReference).not.toBeNull();
        expect(pageReference.type).toBe('standard__objectPage');
        expect(pageReference.attributes.objectApiName).toBe('Contact');
        expect(pageReference.attributes.actionName).toBe('home');
    });
});
