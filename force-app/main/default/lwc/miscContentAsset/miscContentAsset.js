import { LightningElement } from 'lwc';
import recipesLogo from '@salesforce/contentAssetUrl/recipes_sq_logo';

export default class MiscStaticResource extends LightningElement {
    // Expose the content asset URL for use in the template
    recipesLogoUrl = recipesLogo;
}
