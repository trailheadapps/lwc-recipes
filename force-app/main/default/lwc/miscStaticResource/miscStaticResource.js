import { LightningElement } from 'lwc';
import trailheadLogo from '@salesforce/resourceUrl/trailhead_logo';
import trailheadCharacters from '@salesforce/resourceUrl/trailhead_characters';

export default class MiscStaticResource extends LightningElement {
    // Expose the static resource URL for use in the template
    trailheadLogoUrl = trailheadLogo;

    // Expose URL of assets included inside an archive file
    einsteinUrl = trailheadCharacters + '/images/einstein.png';
}
