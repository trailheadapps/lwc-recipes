import { createElement } from '@lwc/engine-dom';
import NavToFlow from 'c/navToFlow';
import {
    getNavigateCalledWith,
    getGenerateUrlCalledWith
} from 'lightning/navigation';
import LightningAlert from 'lightning/alert';

// This test uses a mocked navigation plugin.
// See force-app/test/jest-mocks/lightning/navigation.js for the mock
// and see jest.config.js for jest config to use the mock

const NAV_TYPE = 'standard__flow';
const FLOW_DEV_NAME = 'SimpleGreetingFlow';

describe('c-nav-to-flow', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Reset the navigation mock between tests
        jest.clearAllMocks();
    });

    // Helper function to wait until the microtask queue is empty
    async function flushPromises() {
        return Promise.resolve();
    }

    it('navigates to flow when Launch Flow button is clicked', async () => {
        // Create initial lwc element and attach to virtual DOM
        const element = createElement('c-nav-to-flow', {
            is: NavToFlow
        });
        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Get handle to the Launch Flow button and fire click event
        const buttons = element.shadowRoot.querySelectorAll('lightning-button');
        const launchFlowButton = buttons[0];
        launchFlowButton.click();

        const { pageReference } = getNavigateCalledWith();

        // Verify component called with correct event type and params
        expect(pageReference.type).toBe(NAV_TYPE);
        expect(pageReference.attributes.devName).toBe(FLOW_DEV_NAME);
        expect(pageReference.state).toBeUndefined();
    });

    it('navigates to flow with input variables when Launch Flow with Input button is clicked', async () => {
        // Nav param values to test
        const EXPECTED_USER_NAME = 'Trailblazer';

        // Create initial lwc element and attach to virtual DOM
        const element = createElement('c-nav-to-flow', {
            is: NavToFlow
        });
        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Get handle to the Launch Flow with Input button and fire click event
        const buttons = element.shadowRoot.querySelectorAll('lightning-button');
        const launchFlowWithInputButton = buttons[1];
        launchFlowWithInputButton.click();

        const { pageReference } = getNavigateCalledWith();

        // Verify component called with correct event type, params, and state
        expect(pageReference.type).toBe(NAV_TYPE);
        expect(pageReference.attributes.devName).toBe(FLOW_DEV_NAME);
        expect(pageReference.state.flow__userName).toBe(EXPECTED_USER_NAME);
    });

    it('generates flow URL when Generate Flow URL button is clicked', async () => {
        // Nav param values to test
        const EXPECTED_URL = 'https://www.example.com';

        // Mock LightningAlert.open
        LightningAlert.open = jest.fn().mockResolvedValue();

        // Create initial lwc element and attach to virtual DOM
        const element = createElement('c-nav-to-flow', {
            is: NavToFlow
        });
        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Get handle to the Generate Flow URL button and fire click event
        const buttons = element.shadowRoot.querySelectorAll('lightning-button');
        const generateUrlButton = buttons[2];
        generateUrlButton.click();

        // Wait for the async generateFlowUrl to complete
        await flushPromises();

        const { pageReference } = getGenerateUrlCalledWith();

        // Verify GenerateUrl was called with correct PageReference
        expect(pageReference.type).toBe(NAV_TYPE);
        expect(pageReference.attributes.devName).toBe(FLOW_DEV_NAME);

        // Verify LightningAlert was called with the generated URL
        expect(LightningAlert.open).toHaveBeenCalledTimes(1);
        expect(LightningAlert.open).toHaveBeenCalledWith({
            message: EXPECTED_URL,
            theme: 'info',
            label: 'Generated Flow URL'
        });
    });

    it('is accessible', async () => {
        const element = createElement('c-nav-to-flow', {
            is: NavToFlow
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
