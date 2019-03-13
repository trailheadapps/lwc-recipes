/* global moment */
import { LightningElement, track } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import MOMENT_JS from '@salesforce/resourceUrl/moment';

export default class LibsMomentjs extends LightningElement {
    @track error;
    @track selectedDateTime = new Date().toISOString();
    @track weekOfYear;
    @track dayOfYear;
    @track calculatedDateTime;

    renderedCallback() {
        if (this.momentjsInitialized) {
            return;
        }
        this.momentjsInitialized = true;

        loadScript(this, MOMENT_JS)
            .then(() => {
                this.setMomentValues(this.selectedDateTime);
            })
            .catch(error => {
                this.error = error;
            });
    }

    setMomentValues(dateTime) {
        const mom = moment.utc(dateTime);
        this.selectedDateTime = dateTime;
        this.weekOfYear = mom.week();
        this.dayOfYear = mom.dayOfYear();
        this.calculatedDateTime = mom
            .subtract(3, 'day')
            .add(10, 'hour')
            .subtract(33, 'minute')
            .calendar();
    }

    handleDateTimeChange(event) {
        this.setMomentValues(event.target.value);
    }
}
