import { createElement } from 'lwc';
import LibsD3 from 'c/libsD3';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';

describe('c-libs-d3', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Clear mocks so that every test run has a clean implementation
        jest.clearAllMocks();
    });

    it('contains a svg element for D3', () => {
        // Create initial element
        const element = createElement('c-libs-d3', {
            is: LibsD3
        });
        document.body.appendChild(element);

        const domEl = element.shadowRoot.querySelector('svg[class="d3"]');
        expect(domEl).not.toBeNull();
    });

    it('loads the D3 javascript and css static resources', () => {
        const D3_JS = 'd3/d3.v5.min.js';
        const D3_CSS = 'd3/style.css';

        // Create initial element
        const element = createElement('c-libs-d3', {
            is: LibsD3
        });
        document.body.appendChild(element);

        expect(loadScript.mock.calls.length).toBe(1);
        expect(loadStyle.mock.calls.length).toBe(1);

        expect(loadScript.mock.calls[0][1]).toEqual(D3_JS);
        expect(loadStyle.mock.calls[0][1]).toEqual(D3_CSS);
    });

    // TODO: Add error handling for toast
});
