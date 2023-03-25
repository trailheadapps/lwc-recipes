/**
 * Refresh Event base class
 */
export const RefreshEventName = 'lightning__refreshevent';

export class RefreshEvent extends CustomEvent {
    constructor() {
        super(RefreshEventName, { bubbles: true, composed: true });
    }
}
