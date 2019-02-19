const { jestConfig } = require('@salesforce/lwc-jest/config');
module.exports = {
    ...jestConfig,
    moduleNameMapper: {
        '^@salesforce/apex$': '<rootDir>/force-app/test/jest-mocks/apex'
    }
};
