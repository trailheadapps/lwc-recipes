import LightningDatatable from 'lightning/datatable';
import customPicture from './customPicture.html';
export default class CustomDataTypes extends LightningDatatable {
    static customTypes = {
        customPictureType: {
            template: customPicture,
            standardCellLayout: true,
            typeAttributes: ['pictureUrl']
        }
        // Other Custom Types
    };
}
