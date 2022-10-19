/**
 * For the original lightning/messageService (LMS) stub that comes by default with
 * @salesforce/sfdx-lwc-jest, see:
 * https://github.com/salesforce/sfdx-lwc-jest/blob/master/src/lightning-stubs/messageService/messageService.js
 */
export const APPLICATION_SCOPE = Symbol('APPLICATION_SCOPE');
export const createMessageChannel = jest.fn();
export const createMessageContext = jest.fn();
export const MessageContext = jest.fn();
export const releaseMessageContext = jest.fn();

// Counter that keeps track of mock subscription IDs
let mockSubsriptionId = 0;

// Assigns a handler for each channel subscribed, so that multiple channels can be subscribed to
// within the same test execution context
const handlers = {};

export const publish = jest.fn((messageContext, messageChannel, message) => {
    handlers[messageChannel]?.forEach((handlerObj) =>
        handlerObj.handler(message)
    );
});

export const subscribe = jest.fn(
    (messageContext, messageChannel, messageHandler) => {
        const subscriptionId = mockSubsriptionId++;

        if (!handlers[messageChannel]) {
            handlers[messageChannel] = [];
        }

        handlers[messageChannel].push({
            id: subscriptionId,
            handler: messageHandler
        });

        return { id: subscriptionId };
    }
);

export const unsubscribe = jest.fn((subscription) => {
    Object.keys(handlers).forEach((messageChannel) => {
        handlers[messageChannel] = handlers[messageChannel].filter(
            (handler) => handler.id !== subscription.id
        );
    });
});
