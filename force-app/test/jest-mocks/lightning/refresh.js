/**
 * Refresh Event base class
 */
export const RefreshEventName = 'lightning__refreshevent';

export class RefreshEvent extends CustomEvent {
    constructor() {
        super(RefreshEventName, { bubbles: true, composed: true });
    }
}

let eventHandler;
let elementToRefresh;
export const registerRefreshHandler = jest.fn((element, handler) => {
    elementToRefresh = element;
    eventHandler = handler;
    elementToRefresh.addEventListener(RefreshEvent, eventHandler);
});

export const unregisterRefreshHandler = jest.fn((id) => {
    elementToRefresh.removeEventListener(RefreshEvent, eventHandler);
});
