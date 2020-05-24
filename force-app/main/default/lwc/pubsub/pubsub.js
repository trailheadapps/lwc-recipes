/**
 * A basic pub-sub mechanism for sibling component communication
 *
 * TODO - adopt standard flexipage sibling communication mechanism when it's available.
 */

const SUFFIX_ONREGISTER_EVENTNAME = '_onRegister';
const events = {};

/**
 * Confirm that two page references have the same attributes
 * @param {object} pageRef1 - The first page reference
 * @param {object} pageRef2 - The second page reference
 */
const samePageRef = (pageRef1, pageRef2) => {
    const obj1 = pageRef1.attributes;
    const obj2 = pageRef2.attributes;
    return Object.keys(obj1)
        .concat(Object.keys(obj2))
        .every((key) => {
            return obj1[key] === obj2[key];
        });
};

/**
 * Registers a callback for an event
 * @param {string} eventName - Name of the event to listen for.
 * @param {function} callback - Function to invoke when said event is fired.
 * @param {object} thisArg - The value to be passed as the this parameter to the callback function is bound.
 */
const registerListener = (eventName, callback, thisArg) => {
    // Checking that the listener has a pageRef property. We rely on that property for filtering purpose in fireEvent()
    if (!thisArg.pageRef) {
        throw new Error(
            'pubsub listeners need a "@wire(CurrentPageReference) pageRef" property'
        );
    }

    if (!events[eventName]) {
        events[eventName] = [];
    }
    const duplicate = events[eventName].find((listener) => {
        return listener.callback === callback && listener.thisArg === thisArg;
    });
    if (!duplicate) {
        events[eventName].push({ callback, thisArg });
        if (!eventName.endsWith( SUFFIX_ONREGISTER_EVENTNAME )) {
            informPublishers(thisArg.pageRef, eventName);
        }
    }
};

/**
 * Unregisters a callback for an event
 * @param {string} eventName - Name of the event to unregister from.
 * @param {function} callback - Function to unregister.
 * @param {object} thisArg - The value to be passed as the this parameter to the callback function is bound.
 */
const unregisterListener = (eventName, callback, thisArg) => {
    if (events[eventName]) {
        events[eventName] = events[eventName].filter(
            (listener) =>
                listener.callback !== callback || listener.thisArg !== thisArg
        );
    }
};

/**
 * Unregisters all event listeners bound to an object.
 * @param {object} thisArg - All the callbacks bound to this object will be removed.
 */
const unregisterAllListeners = (thisArg) => {
    Object.keys(events).forEach((eventName) => {
        events[eventName] = events[eventName].filter(
            (listener) => listener.thisArg !== thisArg
        );
    });
};

/**
 * Fires an event to listeners.
 * @param {object} pageRef - Reference of the page that represents the event scope.
 * @param {string} eventName - Name of the event to fire.
 * @param {*} payload - Payload of the event to fire.
 */
const fireEvent = (pageRef, eventName, payload) => {
    if (events[eventName]) {
        const listeners = events[eventName];
        listeners.forEach((listener) => {
            if (samePageRef(pageRef, listener.thisArg.pageRef)) {
                try {
                    listener.callback.call(listener.thisArg, payload);
                } catch (error) {
                    // fail silently
                }
            }
        });
    }
};

/**
 * Registers a callback on new listeners
 * Allowing Publishers to respond when a listener is subscribed AFTER initiation of publisher
 * Use case: send an initial event to any (new) listener
 */
const onNewListeners = (eventName, callback, thisArg) => {
    // Execute registerListener logic for OnRegister EventName with provided callback and thisArg
    registerListener(eventName + SUFFIX_ONREGISTER_EVENTNAME, callback, thisArg);
}

/**
 * Internal method to inform Publishers which requested to be informed when a new Listener is registered
 * @param {string} eventName - Name of the event the registration handler is for
 */
const informPublishers = (pageRef,eventName) => {
    // Execute fireEvent logic passing Current pageRef, OnRegister EventName and the EventName as Payload
    fireEvent(pageRef, eventName + SUFFIX_ONREGISTER_EVENTNAME, eventName);
}

export {
    registerListener,
    unregisterListener,
    unregisterAllListeners,
    fireEvent,
    onNewListeners
};
