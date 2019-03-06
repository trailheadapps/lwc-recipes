import { LightningElement, track } from 'lwc';
import checkTypes from '@salesforce/apex/ApexTypesController.checkApexTypes';

export default class ApexImperativeMethodWithApexTypeParams extends LightningElement {
    @track searchKey = '';
    @track contacts;
    @track error;

    handleSearch() {
        // something
        const typeTest = {
            sett: {
                message: 'some message',
                apexChatterSettings: {
                    type: 'some type',
                    recipient: 'some recipient',
                    allCoverage: true,
                    coverageDropThreshold: 111
                }
            }
        };

        checkTypes(typeTest)
            .then(result => {
                // eslint-disable-next-line no-console
                console.log(result);
            })
            .catch(error => {
                // eslint-disable-next-line no-console
                console.log(error);
            });
    }
}
