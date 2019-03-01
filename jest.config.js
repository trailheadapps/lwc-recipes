const { jestConfig } = require('@salesforce/lwc-jest/config');
module.exports = {
    ...jestConfig,
    moduleNameMapper: {
        '^@salesforce/apex$': '<rootDir>/force-app/test/jest-mocks/apex',
        '^lightning/navigation$':
            '<rootDir>/force-app/test/jest-mocks/lightning/navigation',
        '^lightning/platformShowToastEvent$':
            '<rootDir>/force-app/test/jest-mocks/lightning/platformShowToastEvent'
    }
};
