/**
 * Close Screen Action Event base class
 */
export const CloseScreenEventName = 'lightning__actionsclosescreen';

export class CloseActionScreenEvent extends CustomEvent {
    constructor() {
        super(CloseScreenEventName, { bubbles: false, composed: false });
    }
}
