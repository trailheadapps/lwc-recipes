import { createElement } from 'lwc';
import MiscContentAsset from 'c/miscContentAsset';

describe('c-misc-content-asset', () => {
    it('sets img url based on content asset', () => {
        // Create initial element
        const element = createElement('c-misc-content-asset', {
            is: MiscContentAsset
        });
        document.body.appendChild(element);

        // Query for img element that uses a content asset
        const imgRecipesEl = element.shadowRoot.querySelector(
            'img[alt="Recipes logo"]'
        );
        expect(imgRecipesEl).not.toBeNull();
        // sfdx-lwc-jest automocks @salesforce/contentAsset, and returns localhost/name_of_content_asset.
        expect(imgRecipesEl.src).toBe('http://localhost/recipes_sq_logo');
    });
});
