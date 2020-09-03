/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// Since this is not a typescript project, disabling typescript eslint warning
// TODO (lint): using 'exclude: ["./packages/test-integration/**/*.js"]' in tsconfig.eslint.json doesn't work
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { registerSa11yMatcher } = require('@sa11y/jest');

registerSa11yMatcher();
