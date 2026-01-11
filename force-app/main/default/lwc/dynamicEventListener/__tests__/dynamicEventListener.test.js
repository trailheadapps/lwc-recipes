import { createElement } from '@lwc/engine-dom';
import DynamicEventListener from 'c/dynamicEventListener';

describe('c-dynamic-event-listener', () => {
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

    it('renders with default click mode and initial message', () => {
        // Create component
        const element = createElement('c-dynamic-event-listener', {
            is: DynamicEventListener
        });
        document.body.appendChild(element);

        // Query the interactive box
        const interactiveBox =
            element.shadowRoot.querySelector('.interactive-box');
        const boxMessage = element.shadowRoot.querySelector('.box-message');
        const boxHint = element.shadowRoot.querySelector('.box-hint');

        expect(boxMessage.textContent).toBe('Interact with the box!');

        // Verify default mode class is applied
        expect(interactiveBox.classList.contains('click-mode')).toBe(true);
        expect(interactiveBox.classList.contains('hover-mode')).toBe(false);

        // Verify hint text for click mode
        expect(boxHint.textContent).toBe('👆 Click here');

        // Verify default mode is displayed
        const modeDisplay = element.shadowRoot.querySelector(
            '.slds-text-color_weak strong'
        );
        expect(modeDisplay.textContent).toBe('click');
    });

    it('displays correct button variants based on mode', () => {
        // Create component
        const element = createElement('c-dynamic-event-listener', {
            is: DynamicEventListener
        });
        document.body.appendChild(element);

        // Query buttons
        const buttons = element.shadowRoot.querySelectorAll('lightning-button');
        const clickButton = buttons[0];
        const hoverButton = buttons[1];

        // In default click mode, Click button should be 'brand' and Hover should be 'neutral'
        expect(clickButton.variant).toBe('brand');
        expect(hoverButton.variant).toBe('neutral');
    });

    it('switches to hover mode when Hover Mode button is clicked', async () => {
        // Create component
        const element = createElement('c-dynamic-event-listener', {
            is: DynamicEventListener
        });
        document.body.appendChild(element);

        // Query buttons
        const buttons = element.shadowRoot.querySelectorAll('lightning-button');
        const hoverButton = buttons[1];

        // Click the Hover Mode button
        hoverButton.click();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Verify mode changed
        const modeDisplay = element.shadowRoot.querySelector(
            '.slds-text-color_weak strong'
        );
        expect(modeDisplay.textContent).toBe('hover');

        // Verify message updated
        const boxMessage = element.shadowRoot.querySelector('.box-message');
        expect(boxMessage.textContent).toBe('Now using HOVER mode');

        // Verify box class changed to hover-mode
        const interactiveBox =
            element.shadowRoot.querySelector('.interactive-box');
        expect(interactiveBox.classList.contains('hover-mode')).toBe(true);
        expect(interactiveBox.classList.contains('click-mode')).toBe(false);

        // Verify hint text for hover mode
        const boxHint = element.shadowRoot.querySelector('.box-hint');
        expect(boxHint.textContent).toBe('🖐️ Hover over me');

        // Verify button variants switched
        const clickButton = buttons[0];
        expect(clickButton.variant).toBe('neutral');
        expect(hoverButton.variant).toBe('brand');
    });

    it('switches back to click mode when Click Mode button is clicked', async () => {
        // Create component
        const element = createElement('c-dynamic-event-listener', {
            is: DynamicEventListener
        });
        document.body.appendChild(element);

        // Query buttons
        const buttons = element.shadowRoot.querySelectorAll('lightning-button');
        const clickButton = buttons[0];
        const hoverButton = buttons[1];

        // First switch to hover mode
        hoverButton.click();
        await flushPromises();

        // Then switch back to click mode
        clickButton.click();
        await flushPromises();

        // Verify mode changed back
        const modeDisplay = element.shadowRoot.querySelector(
            '.slds-text-color_weak strong'
        );
        expect(modeDisplay.textContent).toBe('click');

        // Verify message updated
        const boxMessage = element.shadowRoot.querySelector('.box-message');
        expect(boxMessage.textContent).toBe('Now using CLICK mode');

        // Verify box class changed back to click-mode
        const interactiveBox =
            element.shadowRoot.querySelector('.interactive-box');
        expect(interactiveBox.classList.contains('click-mode')).toBe(true);
        expect(interactiveBox.classList.contains('hover-mode')).toBe(false);

        // Verify hint text for click mode
        const boxHint = element.shadowRoot.querySelector('.box-hint');
        expect(boxHint.textContent).toBe('👆 Click here');

        // Verify button variants switched back
        expect(clickButton.variant).toBe('brand');
        expect(hoverButton.variant).toBe('neutral');
    });

    it('handles click event on interactive box in click mode', async () => {
        // Create component
        const element = createElement('c-dynamic-event-listener', {
            is: DynamicEventListener
        });
        document.body.appendChild(element);

        // Query the interactive box
        const interactiveBox =
            element.shadowRoot.querySelector('.interactive-box');

        // Dispatch click event
        interactiveBox.dispatchEvent(new CustomEvent('click'));

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Verify message updated after click
        const boxMessage = element.shadowRoot.querySelector('.box-message');
        expect(boxMessage.textContent).toBe('🖱️ You clicked!');
    });

    it('handles mouseenter and mouseleave events in hover mode', async () => {
        // Create component
        const element = createElement('c-dynamic-event-listener', {
            is: DynamicEventListener
        });
        document.body.appendChild(element);

        // Switch to hover mode first
        const buttons = element.shadowRoot.querySelectorAll('lightning-button');
        const hoverButton = buttons[1];
        hoverButton.click();
        await flushPromises();

        // Query the interactive box
        const interactiveBox =
            element.shadowRoot.querySelector('.interactive-box');
        const boxMessage = element.shadowRoot.querySelector('.box-message');

        // Dispatch mouseenter event
        interactiveBox.dispatchEvent(new CustomEvent('mouseenter'));
        await flushPromises();

        // Verify message updated after mouseenter
        expect(boxMessage.textContent).toBe('✨ Mouse entered!');

        // Dispatch mouseleave event
        interactiveBox.dispatchEvent(new CustomEvent('mouseleave'));
        await flushPromises();

        // Verify message updated after mouseleave
        expect(boxMessage.textContent).toBe('👋 Mouse left!');
    });

    it('displays correct hint text based on mode', async () => {
        // Create component
        const element = createElement('c-dynamic-event-listener', {
            is: DynamicEventListener
        });
        document.body.appendChild(element);

        // Verify initial hint text for click mode
        const boxHint = element.shadowRoot.querySelector('.box-hint');
        expect(boxHint.textContent).toBe('👆 Click here');

        // Switch to hover mode
        const buttons = element.shadowRoot.querySelectorAll('lightning-button');
        const hoverButton = buttons[1];
        hoverButton.click();
        await flushPromises();

        // Verify hint text changed for hover mode
        expect(boxHint.textContent).toBe('🖐️ Hover over me');

        // Switch back to click mode
        const clickButton = buttons[0];
        clickButton.click();
        await flushPromises();

        // Verify hint text returned to click mode
        expect(boxHint.textContent).toBe('👆 Click here');
    });

    it('is accessible', async () => {
        const element = createElement('c-dynamic-event-listener', {
            is: DynamicEventListener
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
