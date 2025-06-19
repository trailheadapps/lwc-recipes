'use strict';

const { defineConfig } = require('eslint/config');
const eslintJs = require('@eslint/js');
const jestPlugin = require('eslint-plugin-jest');
const auraConfig = require('@salesforce/eslint-plugin-aura');
const salesforceLwcConfig = require('@salesforce/eslint-config-lwc/recommended');
const globals = require('globals');

module.exports = defineConfig([
    // Global ignores
    {
        ignores: [
            'force-app/main/default/staticresources/**', // Ignore third party libraries
            'force-app/test/jest-mocks/lightning/modal.js' // Ignore modal mock as it contains decorators (unsupported by ESLint)
        ]
    },

    // Aura configuration
    {
        files: ['force-app/main/default/aura/**/*.js'],
        extends: [
            ...auraConfig.configs.recommended,
            ...auraConfig.configs.locker
        ]
    },

    // LWC configuration for force-app/main/default/lwc
    {
        files: ['force-app/main/default/lwc/**/*.js'],
        extends: [salesforceLwcConfig]
    },

    // LWC configuration with override for LWC test files
    {
        files: ['force-app/main/default/lwc/**/*.test.js'],
        extends: [salesforceLwcConfig],
        rules: {
            '@lwc/lwc/no-unexpected-wire-adapter-usages': 'off'
        },
        languageOptions: {
            globals: {
                ...globals.node
            }
        }
    },

    // Jest mocks configuration
    {
        files: ['force-app/test/jest-mocks/**/*.js'],
        languageOptions: {
            sourceType: 'module',
            ecmaVersion: 'latest',
            globals: {
                ...globals.node,
                ...globals.es2021,
                ...jestPlugin.environments.globals.globals,
                CustomEvent: 'readonly',
                window: 'readonly'
            }
        },
        plugins: {
            eslintJs
        },
        extends: ['eslintJs/recommended']
    }
]);
