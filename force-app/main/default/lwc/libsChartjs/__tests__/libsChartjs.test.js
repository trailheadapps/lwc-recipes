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
    async function flushPromises() {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        return new Promise((resolve) => setTimeout(resolve, 0));
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

    it('loads the ChartJS javascript and css static resources', () => {
        const CHARTJS_JS = 'chartJs';

        // Create initial element
        const element = createElement('c-libs-chartjs', {
            is: LibsChartjs
        });
        document.body.appendChild(element);

        // Validation that the loadScript and loadStyle promises are each called once.
        expect(loadScript.mock.calls.length).toBe(1);
        // Validation that the chartjs js and css static resources are each passed as parameters.
        expect(loadScript.mock.calls[0][1]).toEqual(CHARTJS_JS);
    });

    it('shows the error panel element on static resource load error', async () => {
        loadScript.mockRejectedValue(LOAD_SCRIPT_ERROR);

        // Create initial element
        const element = createElement('c-libs-chartjs', {
            is: LibsChartjs
        });
        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates.
        await flushPromises();

        const errorPanelEl = element.shadowRoot.querySelector('c-error-panel');
        return expect(errorPanelEl).not.toBeNull();
    });

    it('is accessible when library is loaded', async () => {
        const element = createElement('c-libs-chartjs', {
            is: LibsChartjs
        });

        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });

    it('is accessible when there is an error loading library', async () => {
        loadScript.mockRejectedValue(LOAD_SCRIPT_ERROR);

        const element = createElement('c-libs-chartjs', {
            is: LibsChartjs
        });

        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });
});
