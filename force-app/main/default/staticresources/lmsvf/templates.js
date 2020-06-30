'use strict';

function singleItemTemplate(contact) {
    const nodeString = `
        <div class="slds-var-m-around_medium">
            <img src="${contact.get(
                'Picture__c'
            )}" class="img-small" alt="Profile photo">
        </div>
        <p>${contact.get('Name')}</p>
        <p>${contact.get('Title')}</p>
        <p>
            <a href="tel:${contact.get('Phone')}">${contact.get('Phone')}</a>
        </p>
        <p>
            <a href="mailto:${contact.get('Email')}">${contact.get('Email')}</a>
        </p>
    `;

    return nodeString;
}

function listItemTemplate(item) {
    const nodeString = `
        <li data-id="${item.get('Id')}">
            <a href="#">
                <div class="slds-grid slds-grid_vertical-align-center">
                    <div>
                        <img class="img-thumb" src="${item.get('Picture__c')}">
                    </div>
                    <div class="slds-var-p-around_small">
                        ${item.get('Name')}
                    </div>
                </div>
            </a
        </li>
    `;

    return nodeString;
}

export { singleItemTemplate, listItemTemplate };
