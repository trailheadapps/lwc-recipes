const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');
const setupFilesAfterEnv = jestConfig.setupFilesAfterEnv || [];
setupFilesAfterEnv.push('<rootDir>/jest-sa11y-setup.js');
setupFilesAfterEnv.push('<rootDir>/jest-crypto-setup.js');
module.exports = {
    ...jestConfig,
    moduleNameMapper: {
        '^@salesforce/apex$': '<rootDir>/force-app/test/jest-mocks/apex',
        '^@salesforce/schema$': '<rootDir>/force-app/test/jest-mocks/schema',
        '^lightning/navigation$':
            '<rootDir>/force-app/test/jest-mocks/lightning/navigation',
        '^lightning/platformShowToastEvent$':
            '<rootDir>/force-app/test/jest-mocks/lightning/platformShowToastEvent',
        '^lightning/uiRecordApi$':
            '<rootDir>/force-app/test/jest-mocks/lightning/uiRecordApi',
        '^lightning/messageService$':
            '<rootDir>/force-app/test/jest-mocks/lightning/messageService',
        '^lightning/actions$':
            '<rootDir>/force-app/test/jest-mocks/lightning/actions',
        '^lightning/alert$':
            '<rootDir>/force-app/test/jest-mocks/lightning/alert',
        '^lightning/confirm$':
            '<rootDir>/force-app/test/jest-mocks/lightning/confirm',
        '^lightning/prompt$':
            '<rootDir>/force-app/test/jest-mocks/lightning/prompt'
    },
    setupFiles: ['jest-canvas-mock'],
    setupFilesAfterEnv,
    testTimeout: 10000
};
