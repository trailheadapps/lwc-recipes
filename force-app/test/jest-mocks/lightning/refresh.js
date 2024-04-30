/**
 * Refresh Event base class
 */
export const RefreshEventName = 'lightning__refresh';
export class RefreshEvent extends CustomEvent {
    constructor() {
        super(RefreshEventName, {
            composed: true,
            cancelable: true,
            bubbles: true
        });
    }
}

let eventHandler;
let elementToRefresh;
export const registerRefreshHandler = jest.fn((element, handler) => {
    elementToRefresh = element;
    eventHandler = handler;
    window.addEventListener(
        RefreshEventName,
        eventHandler.bind(elementToRefresh)
    );
});

export const unregisterRefreshHandler = jest.fn((id) => {
    window.removeEventListener(
        RefreshEventName,
        eventHandler.bind(elementToRefresh)
    );
});
