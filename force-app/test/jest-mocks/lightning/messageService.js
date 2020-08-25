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
export const unsubscribe = jest.fn();
// LMS stub implementation that lets you test a single message handler on a single channel
var _messageChannel = null;
var _messageHandler = null;
export const publish = jest.fn((messageContext, messageChannel, message) => {
    if (_messageHandler && _messageChannel === messageChannel) {
        _messageHandler(message);
    }
});
export const subscribe = jest.fn(
    (messageContext, messageChannel, messageHandler) => {
        _messageChannel = messageChannel;
        _messageHandler = messageHandler;
    }
);
