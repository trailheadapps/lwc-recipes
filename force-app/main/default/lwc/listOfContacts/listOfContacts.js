import { LightningElement, api,track, wire } from 'lwc';
import getFirstRecords from '@salesforce/apex/contactRecord.getContactList';


export default class ListOfContacts extends LightningElement {
    @track _txtBoxVal = '';
    @api
    get txtBoxVal(){
            return this._txtBoxVal;
        }
     
        set txtBoxVal(val){
            this._txtBoxVal = val;
        }     
    
 
    columns = [
        {
            label: 'firstname', fieldName: 'linkName', type: 'url',
            typeAttributes: { label: { fieldName: 'FirstName' }, target: '_blank' }
        },
        { label: 'lastname', fieldName: 'LastName' },
        { label: 'title', fieldName: 'Title' },

    ];
    @track data = [];
    count = 0;

    constructor() {
        super();
        getFirstRecords({

        })
            .then(result => {
                if (result) {
                    this.data = result.map(row => {
                        let linkName = '/' + row.Id;
                        return { ...row, linkName }
                    })
                }
            })
            .catch(error => {
                error = error;
            });
    }
    removeRecord() {
        this.getData = false;
        let remList = [];
        remList = this.data;
        var index = 5;
        remList.splice(index, 1);
        this.data = [];
        console.log(this.data);

        this.data = remList;
        this.count = this.data.length;
        this.getData = true;
        console.log(this.data);
        eval("$A.get('e.force:refreshView').fire();");

    }
    getData = false;
}