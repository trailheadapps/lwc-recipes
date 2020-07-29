import { createElement } from 'lwc';
import MiscStaticResource from 'c/miscStaticResource';

describe('c-misc-static-resource', () => {
    it('sets img urls based on static resources', () => {
        // Create initial element
        const element = createElement('c-misc-static-resource', {
            is: MiscStaticResource
        });
        document.body.appendChild(element);

        // Query for img element that uses a static image resource
        const imgTrailheadEl = element.shadowRoot.querySelector(
            'img[alt="Trailhead logo"]'
        );
        expect(imgTrailheadEl).not.toBeNull();
        // sfdx-lwc-jest automocks @salesforce/resourceUsl, and returns localhost/name_of_resource.
        expect(imgTrailheadEl.src).toBe('http://localhost/trailhead_logo');

        // Query for img element that uses a static image resource within a zip file
        const imgEinsteinEl = element.shadowRoot.querySelector(
            'img[alt="Einstein logo"]'
        );
        expect(imgEinsteinEl).not.toBeNull();
        // sfdx-lwc-jest automocks @salesforce/resourceUsl, and returns localhost/name_of_resource.
        expect(imgEinsteinEl.src).toBe(
            'http://localhost/trailhead_characters/images/einstein.png'
        );
    });
});
