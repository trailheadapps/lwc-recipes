import { createElement } from 'lwc';
import CompositionWithAppBuilder from 'c/compositionWithAppBuilder';

describe('c-composition-with-app-builder', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('reflects public property values', () => {
        // Create component
        const element = createElement('c-composition-with-app-builder', {
            is: CompositionWithAppBuilder
        });
        // Set public properties
        element.picklistValue = 'somePicklist';
        element.stringValue = 'someString';
        element.numberValue = 99;
        document.body.appendChild(element);

        expect(element.picklistValue).toBe('somePicklist');
        expect(element.stringValue).toBe('someString');
        expect(element.numberValue).toBe(99);
    });

    it('is accessible', async () => {
        const element = createElement('c-composition-with-app-builder', {
            is: CompositionWithAppBuilder
        });

        element.picklistValue = 'somePicklist';
        element.stringValue = 'someString';
        element.numberValue = 99;
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
