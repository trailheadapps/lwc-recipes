import { createElement } from 'lwc';
import MiscStaticResource from 'c/miscStaticResource';

describe('c-misc-static-resource', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('sets img urls based on static resources', () => {
        // Create component
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

    it('is accessible', async () => {
        const element = createElement('c-misc-static-resource', {
            is: MiscStaticResource
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});
