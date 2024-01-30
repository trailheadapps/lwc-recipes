/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, api } from 'lwc';

const LIGHTNING_MODAL_HEADER = 'lightning-modal-header';
const LIGHTNING_MODAL_BODY = 'lightning-modal-body';
const LIGHTNING_MODAL_FOOTER = 'lightning-modal-footer';

function getSlotNodes(template, element) {
    const child = template.querySelector(element).shadowRoot.children[0];
    if (child) {
        return child.assignedNodes();
    }
    return [];
}

function query(nodes, selectors) {
    return [...nodes].reduce((previousValue, currentValue) => {
        const matches = [];
        // Root nodes, ignores text nodes
        if (currentValue.matches && currentValue.matches(selectors)) {
            matches.push(currentValue);
        }
        // Query nested nodes, ignroes text nodes
        if (currentValue.querySelectorAll) {
            return [
                ...previousValue,
                ...matches,
                ...currentValue.querySelectorAll(selectors)
            ];
        }
        return previousValue;
    }, []);
}

function select(template, element, selectors) {
    const nodes = getSlotNodes(template, element);
    if (selectors) {
        const matches = query(nodes, selectors);
        return matches.length === 0 ? null : matches[0];
    }
    return nodes.length === 0 ? null : nodes[0];
}

function selectAll(template, element, selectors) {
    const nodes = getSlotNodes(template, element);
    if (selectors) {
        const matches = query(nodes, selectors);
        return matches;
    }
    return [...nodes];
}

/**
 * This mock provides several short hand helpers
 */
export default class LightningModal extends LightningElement {
    static open(apis) {
        throw new Error(
            'The LightningModal documentation contains examples for mocking .open'
        );
    }

    @api size;
    @api label;

    @api
    close(result) {
        this.closeValue = result;
    }

    /**
     * Result value passed into this.close(result)
     */
    @api closeValue;

    /**
     * Query select a single element in lightning-modal-header
     * Usage: `element.modalHeader$('a')` Returns first link
     * @param {string} selectors Ex: 'div', 'button, [data-button]'
     * @returns element
     */
    @api
    modalHeader$(selectors = '') {
        return select(this.template, LIGHTNING_MODAL_HEADER, selectors);
    }

    /**
     * Query select multiple elements in lightning-modal-header
     * Usage:
     * - `elem.modalHeader$$()` Returns all nodes in header
     * - `elem.modalHeader$$('a')` Returns all links in header
     * @param {string} selectors Ex: 'div', 'button, [data-button]'
     * @returns elements[]
     */
    @api
    modalHeader$$(selectors = '') {
        return selectAll(this.template, LIGHTNING_MODAL_HEADER, selectors);
    }

    /**
     * Query select a single element in lightning-modal-body
     * Usage: `element.modalBody$('button')` Returns first button
     * @param {string} selectors Ex: 'div', 'button, [data-button]'
     * @returns element
     */
    @api
    modalBody$(selectors = '') {
        return select(this.template, LIGHTNING_MODAL_BODY, selectors);
    }

    /**
     * Query select multiple elements in lightning-modal-body
     * Usage:
     * - `elem.modalBody$$()` Returns all nodes in body
     * - `elem.modalBody$$('button, [data-button]')` Returns buttons in body
     * @param {string} selectors Ex: 'div', 'button, [data-button]'
     * @returns elements[]
     */
    @api
    modalBody$$(selectors = '') {
        return selectAll(this.template, LIGHTNING_MODAL_BODY, selectors);
    }

    /**
     * Query select a single element in lightning-modal-footer
     * Usage: `element.modalFooter$('button')` Returns first button
     * @param {string} selectors Ex: 'div', 'button, [data-button]'
     * @returns element
     */
    @api
    modalFooter$(selectors = '') {
        return select(this.template, LIGHTNING_MODAL_FOOTER, selectors);
    }

    /**
     * Query select multiple elements in lightning-modal-footer
     * Usage:
     * - `elem.modalFooter$$()` Returns all nodes in footer
     * - `elem.modalFooter$$('button, [data-button]')` Returns buttons in footer
     * @param {string} selectors Ex: 'div', 'button, [data-button]'
     * @returns elements[]
     */
    @api
    modalFooter$$(selectors = '') {
        return selectAll(this.template, LIGHTNING_MODAL_FOOTER, selectors);
    }
}
