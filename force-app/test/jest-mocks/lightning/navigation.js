/**
 * For the original lightning/navigation mock that comes by default with
 * @salesforce/sfdx-lwc-jest, see:
 * https://github.com/salesforce/sfdx-lwc-jest/blob/master/src/lightning-stubs/navigation/navigation.js
 */

import { createTestWireAdapter } from '@salesforce/wire-service-jest-util';
export const CurrentPageReference = createTestWireAdapter(jest.fn());

const Navigate = Symbol('Navigate');
const GenerateUrl = Symbol('GenerateUrl');

// We need the mock to reset between tests, so we hold the state in jest.fn() objects.
// We use Jest's reflection methods to implement the two CalledWith helpers below so we need to update all the existing tests.
// A cleaner implementation would just export these two mocks directly for consumption by the test authors to verify the state.
export const mockNavigate = jest.fn();
export const mockGenerate = jest.fn();

export const NavigationMixin = Base => {
    return class extends Base {
        [Navigate](pageReference, replace) {
            mockNavigate({ pageReference, replace });
        }
        [GenerateUrl](pageReference) {
            mockGenerate({ pageReference });
            return new Promise(resolve => resolve('https://www.example.com'));
        }
    };
};
NavigationMixin.Navigate = Navigate;
NavigationMixin.GenerateUrl = GenerateUrl;

/*
 * Tests do not have access to the internals of this mixin used by the
 * component under test so save a reference to the arguments the Navigate method is
 * invoked with and provide access with this function.
 */
export const getNavigateCalledWith = () => {
    // If the mock was never called, return the object with undefined properties.
    // This prevents exceptions when tests destructure this object, allowing them to
    // fail in more expected ways as the test verifies properties on the pageReference object.
    if (mockNavigate.mock.calls.length === 0) {
        return {
            pageReference: undefined,
            replace: undefined
        };
    }

    // If the mock was called (with one object), get the last call and return it.
    // Because the mock is called with a single object, it's at the zero index.
    return mockNavigate.mock.calls[mockNavigate.mock.calls.length - 1][0];
};

export const getGenerateUrlCalledWith = () => {
    // If the mock was never called, return the object with undefined properties.
    // This prevents exceptions when tests destructure this object, allowing them to
    // fail in more expected ways as the test verifies properties on the pageReference object.
    if (mockGenerate.mock.calls.length === 0) {
        return {
            pageReference: undefined
        };
    }

    // If the mock was called (with one object), get the last call and return it.
    // Because the mock is called with a single object, it's at the zero index.
    return mockGenerate.mock.calls[mockGenerate.mock.calls.length - 1][0];
};