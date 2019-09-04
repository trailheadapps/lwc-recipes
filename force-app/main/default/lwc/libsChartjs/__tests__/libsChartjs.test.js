import { createElement } from 'lwc';
import LibsChartjs from 'c/libsChartjs';
import { loadScript } from 'lightning/platformResourceLoader';

// Sample error for loadScript error
const LOAD_SCRIPT_ERROR = {
    body: { message: 'An internal server error has occurred' },
    ok: false,
    status: 400,
    statusText: 'Bad Request'
};

describe('c-libs-chartjs', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Clear mocks so that every test run has a clean implementation
        jest.clearAllMocks();
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when the platformResourceLoader promises.
    function flushPromises() {
        // eslint-disable-next-line no-undef
        return new Promise(resolve => setImmediate(resolve));
    }

    it('contains a canvas element for ChartJs', () => {
        // Create initial element
        const element = createElement('c-libs-chartjs', {
            is: LibsChartjs
        });
        document.body.appendChild(element);

        // Querying the DOM element that has the lwc:dom directive set.
        const domEl = element.shadowRoot.querySelector('div.chart');
        expect(domEl).not.toBeNull();
    });

    it('loads the ChartJS javascript static resource', () => {
        const CHARTJS_JS = 'chart';

        // Create initial element
        const element = createElement('c-libs-chartjs', {
            is: LibsChartjs
        });
        document.body.appendChild(element);

        // Validation that the loadScript promise is called once.
        expect(loadScript.mock.calls.length).toBe(1);
        // Validation that the chartjs static resource is passed as parameter.
        expect(loadScript.mock.calls[0][1]).toEqual(CHARTJS_JS);
    });

    it('shows the error panel element on static resource load error', () => {
        loadScript.mockRejectedValue(LOAD_SCRIPT_ERROR);

        // Create initial element
        const element = createElement('c-libs-chartjs', {
            is: LibsChartjs
        });
        document.body.appendChild(element);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return flushPromises().then(() => {
            const errorPanelEl = element.shadowRoot.querySelector(
                'c-error-panel'
            );
            expect(errorPanelEl).not.toBeNull();
        });
    });
});
