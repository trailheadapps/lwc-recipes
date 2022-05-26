/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, api } from 'lwc';

export default class Prompt extends LightningElement {
    static open() {
        throw new Error(
            'The LightningPrompt documentation contains examples for mocking .open in Jest'
        );
    }
    @api defaultValue;
    @api label;
    @api message;
    @api theme;
    @api variant;
}
