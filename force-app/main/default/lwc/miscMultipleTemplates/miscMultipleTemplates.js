import { LightningElement } from 'lwc';
import templateOne from './templateOne.html';
import templateTwo from './templateTwo.html';

import trailheadLogo from '@salesforce/resourceUrl/trailhead_logo';
import trailheadCharacters from '@salesforce/resourceUrl/trailhead_characters';

export default class MiscMultipleTemplates extends LightningElement {
    showTemplateOne = true;

    trailheadLogoUrl = trailheadLogo;
    einsteinUrl = trailheadCharacters + '/images/einstein.png';

    render() {
        return this.showTemplateOne ? templateOne : templateTwo;
    }

    switchTemplate() {
        this.showTemplateOne = !this.showTemplateOne;
    }
}
