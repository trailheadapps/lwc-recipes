import { LightningElement, api } from 'lwc';
import { reduceErrors } from 'c/ldsUtils';
import NODATA_SVG from '@salesforce/resourceUrl/noDataErrorIllustration';

export default class ErrorPanel extends LightningElement {
    /** Single or array of LDS errors */
    @api errors;
    /** Generic / user-friendly message */
    @api friendlyMessage = 'Error retrieving data';

    noDataSvgUrl = `${NODATA_SVG}#noDataErrorIllustration`;
    viewDetails = false;

    get errorMessages() {
        return reduceErrors(this.errors);
    }

    handleCheckboxChange(event) {
        this.viewDetails = event.target.checked;
    }
}
