/**
 * For the original lightning/navigation mock that comes by default with
 * @salesforce/sfdx-lwc-jest, see:
 * https://github.com/salesforce/sfdx-lwc-jest/blob/master/src/lightning-stubs/navigation/navigation.js
 */
export const CurrentPageReference = jest.fn();

let _navigatePageReference, _generatePageReference, _replace;

const Navigate = Symbol('Navigate');
const GenerateUrl = Symbol('GenerateUrl');
export const NavigationMixin = (Base) => {
    return class extends Base {
        [Navigate](pageReference, replace) {
            _navigatePageReference = pageReference;
            _replace = replace;
        }
        [GenerateUrl](pageReference) {
            _generatePageReference = pageReference;
            return new Promise((resolve) => resolve('https://www.example.com'));
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
    return {
        pageReference: _navigatePageReference,
        replace: _replace
    };
};

export const getGenerateUrlCalledWith = () => ({
    pageReference: _generatePageReference
});
