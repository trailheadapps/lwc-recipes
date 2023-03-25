import { LightningElement } from 'lwc';
import FULL_CALENDAR from '@salesforce/resourceUrl/fullCalendar';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
/**
 * When using this component in an LWR site, please import the below custom implementation of 'loadScript' module
 * instead of the one from 'lightning/platformResourceLoader'
 *
 * import { loadScript } from 'c/resourceLoader';
 *
 * This workaround is implemented to get around a limitation of the Lightning Locker library in LWR sites.
 * Read more about it in the "Lightning Locker Limitations" section of the documentation
 * https://developer.salesforce.com/docs/atlas.en-us.exp_cloud_lwr.meta/exp_cloud_lwr/template_limitations.htm
 */

export default class LibsFullCalendar extends LightningElement {
    isCalInitialized = false;
    error;

    async renderedCallback() {
        if (this.isCalInitialized) {
            return;
        }
        this.isCalInitialized = true;

        try {
            await Promise.all([
                loadScript(this, FULL_CALENDAR + '/main.min.js'),
                loadStyle(this, FULL_CALENDAR + '/main.min.css')
            ]);
            this.initializeCalendar();
        } catch (error) {
            this.error = error;
        }
    }

    initializeCalendar() {
        const calendarEl = this.template.querySelector('.calendar');
        // eslint-disable-next-line no-undef
        if (typeof FullCalendar === 'undefined') {
            throw new Error(
                'Could not load FullCalendar. Make sure that Lightning Web Security is enabled for your org. See link below.'
            );
        }
        // eslint-disable-next-line no-undef
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth'
        });
        calendar.render();
    }
}
