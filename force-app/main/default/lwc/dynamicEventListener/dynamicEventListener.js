import { LightningElement } from 'lwc';

/**
 * Shows how to use the lwc:on directive
 * to dynamically attach event listeners to a component
 */
export default class DynamicEventListener extends LightningElement {
    // 'click' or 'hover' mode
    modeOptions = [
        { label: 'Click Mode', value: 'click' },
        { label: 'Hover Mode', value: 'hover' }
    ];

    message = 'Interact with the box!';
    eventMode = 'click';

    /**
     * THE KEY FEATURE: Returns an object of event handlers
     * The lwc:on directive uses this to attach listeners dynamically
     */
    get boxEventHandlers() {
        const handlers = {};

        switch (this.eventMode) {
            case 'click':
                handlers.click = () => {
                    this.message = '🖱️ You clicked!';
                };
                break;
            case 'hover':
                handlers.mouseenter = () => {
                    this.message = '✨ Mouse entered!';
                };
                handlers.mouseleave = () => {
                    this.message = '👋 Mouse left!';
                };
                break;
            // no default
        }

        return handlers;
    }

    handleModeChange(event) {
        this.eventMode = event.detail.value;
        this.message = `Now using ${this.eventMode.toUpperCase()} mode`;
    }

    get boxClass() {
        const modeClass = `${this.eventMode}-mode`;
        return `slds-box slds-box_small slds-text-align_center interactive-box ${modeClass}`;
    }

    get hintText() {
        return this.eventMode === 'click'
            ? '👆 Click here'
            : '🖐️ Hover over me';
    }
}
