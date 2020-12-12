import { LightningElement, track, wire, api } from 'lwc';
import getSobjects from '@salesforce/apex/LwcController.getSobjects';
import getFields from '@salesforce/apex/LwcController.getFieldList';
import getLstRecrds from '@salesforce/apex/LwcController.Getrecords';
export default class lwcDataTable extends LightningElement {
    @track comboboxoptions;
    @track fields;
    @track tempFields = [];
    @track options = [];
    @track selectedOptionsList;
    @track selectedOption;
    @track draftValues;
    @track value = '-None-';
    @track data;
    @track Columns;
    @track defaultSortDirection = 'asc';
    @track sortDirection = 'asc';
    @track sortedBy;
    @track loadMoreStatus;
    @api totalNumberOfRows = 10;
    @track fullData;
    @api isLoading = false;
    @track noOfRowsToDisplay = 10;

    connectedCallback() {
        var lstObjects = [];
        getSobjects({})
            .then(result => {
                console.log(result);
                if (result) {
                    for (var i = 0; i < result.length; i++) {
                        lstObjects.push({
                            label: result[i].strObjlabel,
                            value: result[i].strObjApiName
                        });
                    }
                    this.comboboxoptions = lstObjects;
                }
            })
    }
    handleChange(event) {
        var lstFields = [];
        this.selectedOption = event.detail.value;
        getFields({
                selectedSobject: this.selectedOption
            })
            .then(result => {
                if (result) {
                    for (var i = 0; i < result.length; i++) {
                        lstFields.push({
                            label: result[i].strFieldlabel,
                            value: result[i].strFieldApiName
                        });
                    }
                    this.options = lstFields;
                    this.tempFields = lstFields;
                }
            })
            .catch(error => {
                this.error = error;
            });
    }

    handleSelected(event) {
        this.selectedOptionsList = event.detail.value;
    }
    searchrecords(event) {
        var lstColumns = [];
        var lstData = [];
        getLstRecrds({
                selectedSobject: this.selectedOption,
                selectedpickList: this.selectedOptionsList
            })
            .then(result => {
                for (var i = 0; i < result.lstfields.length; i++) {
                    lstColumns.push({
                        label: result.lstfields[i].strFieldlabel,
                        fieldName: result.lstfields[i].strFieldApiName,
                        sortable: true,
                        editable: true
                    });
                }
                this.Columns = lstColumns;
                let sizeToDisplay;
                this.fullData = result.lstData;
                if (this.fullData.length > this.totalNumberOfRows) {
                    sizeToDisplay = this.totalNumberOfRows;
                } else {
                    sizeToDisplay = this.fullData.length;
                }
                let tempLst = [];
                for (var i = 0; i < sizeToDisplay; i++) {
                    tempLst.push(this.fullData[i]);
                }
                console.log(tempLst);
                this.data = tempLst;
            })
    }
    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.data];
        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.data = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }
    sortBy(field, reverse, primer) {
        const key = primer ?

            function(x) {
                return primer(x[field]);
            } :
            function(x) {
                return x[field];
            };
        return function(a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }

    loadMoreData(event) {
        this.isLoading = true;
        var lstRecords = this.fullData;
        var displayedRecords = this.totalNumberOfRows;
        let totalCount = lstRecords.length;
        var noOfRows = this.noOfRowsToDisplay;
        var loopTil;
        if ((totalCount - displayedRecords) <= noOfRows) {
            loopTil = totalCount;
            this.loadMoreStatus = 'No records Found';
            this.isLoading = false;
        } else {
            loopTil = totalCount - (totalCount - (displayedRecords + noOfRows));
            this.loadMoreStatus = 'Loading';
        }
        var templst = [];
        for (var i = displayedRecords; i < loopTil; i++) {
            templst.push(lstRecords[i]);
        }
        var currentData = this.data;
        var newData = currentData.concat(templst);
        this.data = newData;
        this.totalNumberOfRows = loopTil;
    }
    activefilter(event) {
        console.log('test');
        console.log(this.template.querySelector('[data-id="filterPanel"]'));
        var filterPanel = this.template.querySelector('[data-id="filterPanel"]');
        filterPanel.classList.toggle('slds-is-open');
        filterPanel.classList.toggle('slds-is-close');


    }
}