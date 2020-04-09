import { LightningElement, api } from 'lwc';
import { reduceErrors } from 'c/ldsUtils';
import NODATA_SVG from '@salesforce/resourceUrl/noDataErrorIllustration';

export default class ErrorPanel extends LightningElement {
    /** Generic / user-friendly message */
    @api friendlyMessage = 'Error retrieving data';

    viewDetails = false;
    noDataSvgUrl = `${NODATA_SVG}#noDataErrorIllustration`;

    /** Single or array of LDS errors */
    @api errors;

    get errorMessages() {
        return reduceErrors(this.errors);
    }

    handleCheckboxChange(event) {
        this.viewDetails = event.target.checked;
    }
}
