import { createElement } from 'lwc';
import LibsChartjs from 'c/libsChartjs';
import { loadScript } from 'lightning/platformResourceLoader';

describe('c-libs-chartjs', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Clear mocks so that every test run has a clean implementation
        jest.clearAllMocks();
    });

    it('contains a canvas element for ChartJs', () => {
        // Create initial element
        const element = createElement('c-libs-chartjs', {
            is: LibsChartjs
        });
        document.body.appendChild(element);

        const domEl = element.shadowRoot.querySelector('canvas[class="donut"]');
        expect(domEl).not.toBeNull();
    });

    it('loads the ChartJS javascript static resource', () => {
        const CHARTJS_JS = 'chart';

        // Create initial element
        const element = createElement('c-libs-chartjs', {
            is: LibsChartjs
        });
        document.body.appendChild(element);

        expect(loadScript.mock.calls.length).toBe(1);
        expect(loadScript.mock.calls[0][1]).toEqual(CHARTJS_JS);
    });

    // TODO: Add error handling
});
