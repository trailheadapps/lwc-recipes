import { LightningElement, track, wire, api } from 'lwc';
import getSobjects from '@salesforce/apex/PaginationController.getSobjects';
import getFields from '@salesforce/apex/PaginationController.getFieldList';
import getLstRecrds from '@salesforce/apex/PaginationController.Getrecords';
import getNextRecords from '@salesforce/apex/PaginationController.getNextRecords';
import getLstPrevious from '@salesforce/apex/PaginationController.getPreviousRecords';
import getLastRecords from '@salesforce/apex/PaginationController.getLastRecords';
import getFirstRecords from '@salesforce/apex/PaginationController.getFirstRecords';
import onsaveFilters from '@salesforce/apex/PaginationController.onsaveFilters';
import getfilters from '@salesforce/apex/PaginationController.getFilters';


import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
let i = 0;

export default class LwcDataTablePagination extends LightningElement {
    @track comboboxoptions;
    @track fields;
    @track columnWidthMode;
    @track tempFields = [];
    @track options = [];
    @track selectedOptionsList;
    @track selectedObject;
    @track value = '-None-';
    @track data = [];
    @track columns = [];
    @track defaultSortDirection = 'asc';
    @track sortDirection = 'asc';
    @track sortedBy;
    @track selectedRows = [];
    @track FinalselectedRows = [];
    @track returnSelectedRows = [];


    @track strQuery;
    @track PageNumb;
    @track hasPervious;
    @track hasNext;
    @track totalRecordCount;
    @track pageSize = 3; //default value we are assigning
    @track totalPage = 0; //total number of page is needed to display all records


    @track page = 1; //this will initialize 1st page
    @track items = []; //it contains all the records.
    @track startingRecord = 1; //start record position per page
    @track endingRecord = 0; //end record position per page
    @track totalRecountCount = 0;
    @track filterCount = 0; //total record count received from all retrieved records
    refreshTable;

    /*  @wire(getfilters)
      contacts(result) {
          this.refreshTable = result;
          if (result.data) {
              console.log(result);
           
              this.listFilters = result.data;
              this.filterNo = result.data.length > 0 ? result.data.length - 1 : 0;
              console.log(this.filterNo);
          } else if (result.error) {
              this.error = result.error;
          }
      }
  */

    connectedCallback() {
        getSobjects({

        })
            .then(result => {
                if (result) {
                    this.selectedObject = result[0].value;
                    console.log(result[0].value)
                    this.comboboxoptions = result;
                }
            })
            .catch(error => {
                this.error = error;
            });

        getfilters({
            // objectApiName: this.selectedobject,
        })
            .then(result => {
                if (result) {
                    console.log(result);
                    let index = 0;

                    this.listFilters = result.map(row => {
                        let indx = index;

                        index++;
                        return { ...row, indx }
                    })
                }
                console.log(this.listFilters);
                this.filterNo = result.length > 0 ? result.length - 1 : 0;

            })
            .catch(error => {
                this.error = error;
            });
    }

    handleChange(event) {
        this.selectedObject = event.detail.value;
        getFields({
            selectedSobject: this.selectedObject
        })
            .then(result => {
                if (result) {
                    this.options = result;
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
        getLstRecrds({
            selectedSobject: this.selectedObject,
            selectedpickList: this.selectedOptionsList
        })
            .then(result => {
                this.columns = result.lstfields;
                this.data = result.lstData;
                this.PageNumb = result.PageNumb;
                this.strQuery = result.strQury;
                this.pageSize = result.pageSize;
                this.hasNext = result.hasNext;
                this.hasPervious = result.hasPervious;
                this.totalRecordCount = result.totalRecords;
                console.log(result);

            })
            .catch(error => {
                this.error = error;
            });
    }
    @track selected = [];
    nextHandler() {
        getNextRecords({
            strQuery: this.strQuery,
            PageNumber: this.PageNumb,
            pageSize: this.pageSize,
            selectedRows: this.returnSelectedRows.concat(this.selected)
        })
            .then(result => {
                console.log(result);

                this.data = result.lstData;
                this.PageNumb = result.PageNumb;
                this.strQuery = result.strQury;
                this.pageSize = result.pageSize;
                this.hasNext = result.hasNext;
                this.hasPervious = result.hasPervious;
                this.selected = this.selected.concat(result.selectedRecords);
                var obj = [];
                for (i = 0; i <  this.selected.length; i++) {
                    obj.push(
                        result.lstData[i].Id
                    )
                }
                this.selectedRows = obj;


            })
            .catch(error => {
                this.error = error;
            });
    }

    previousHandler() {
        getLstPrevious({
            strQuery: this.strQuery,
            PageNumber: this.PageNumb,
            pageSize: this.pageSize,
            selectedRows: this.returnSelectedRows.concat(this.selected)
        })
            .then(result => {
                console.log(result);

                this.data = result.lstData;
                this.PageNumb = result.PageNumb;
                this.strQuery = result.strQury;
                this.pageSize = result.pageSize;
                this.hasNext = result.hasNext;
                this.hasPervious = result.hasPervious;
                this.selected = this.selected.concat(result.selectedRecords);
                var obj = [];
                for (i = 0; i <  this.selected.length; i++) {
                    obj.push(
                        result.lstData[i].Id
                    )
                }
                this.selectedRows = obj;            })
            .catch(error => {
                this.error = error;
            });
    }

    lastHandler() {
        getLastRecords({
            strQuery: this.strQuery,
            PageNumber: this.PageNumb,
            pageSize: this.pageSize,
            selectedRows: this.returnSelectedRows.concat(this.selected)
        })
            .then(result => {
                console.log(result);
                this.data = result.lstData;
                this.PageNumb = result.PageNumb;
                this.strQuery = result.strQury;
                this.pageSize = result.pageSize;
                this.hasNext = result.hasNext;
                this.hasPervious = result.hasPervious;
                this.selected = this.selected.concat(result.selectedRecords);
                var obj = [];
                for (i = 0; i <  this.selected.length; i++) {
                    obj.push(
                        result.lstData[i].Id
                    )
                }
                this.selectedRows = obj;

            })
            .catch(error => {
                this.error = error;
            });
    }

    firstHandler() {
        getFirstRecords({
            strQuery: this.strQuery,
            PageNumber: this.PageNumb,
            pageSize: this.pageSize,
            selectedRows: this.returnSelectedRows.concat(this.selected)
        })
            .then(result => {
                console.log(result);

                this.result = result;
                this.data = result.lstData;
                this.PageNumb = result.PageNumb;
                this.strQuery = result.strQury;
                this.pageSize = result.pageSize;
                this.hasNext = result.hasNext;
                this.hasPervious = result.hasPervious;
                this.selected = this.selected.concat(result.selectedRecords);
                var obj = [];
                for (i = 0; i <  this.selected.length; i++) {
                    obj.push(
                        result.lstData[i].Id
                    )
                }
                this.selectedRows = obj;
            })
            .catch(error => {
                this.error = error;
            });
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

            function (x) {
                return primer(x[field]);
            } :
            function (x) {
                return x[field];
            };
        return function (a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }

    get getRecords() {
        return this.data.length > 0 ? true : false;
    }

    get getNextRecords() {
        return hasPervious == true ? false : true;
    }

    handleOnRowselection(event) {

        const ObjselectedRows = event.detail.selectedRows;
        console.log(ObjselectedRows);
        this.returnSelectedRows = ObjselectedRows;


    }

    handleSave(event) {
        const recordInputs = event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            console.log('fields' + fields);
            return { fields };
        });

        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        console.log('promises' + promises);

        Promise.all(promises).then(results => {
            console.log('test' + results);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'All records updated',
                    variant: 'success'
                })
            );
            // Clear all draft values
            this.draftValues = [];
            console.log('test', results);
            // Display fresh data in the datatable
            return refreshApex();
        }).catch(error => {
            // Handle error
        });
    }


    @track index = 0;
    @track listFilters = [];
    @track openPopover = false;
    @track filterNo = 0;
    @track addedNewFilters = false;

    addNewFilter() {

        this.index++;
        this.filterNo++;
        console.log(this.filterNo);
        var newItem = [{
            indx: this.filterNo,
            Id: null,
            Field_Name__c: '',
            Field_value__c: '',
            Field_Type__c: '',
            Object_Name__c: '',
            Operator_Label__c: '',
            Operator_value__c: '',
            Filter_Field_Value__c: '',
            openPopover: true,
            isNewFilter: true
        }];
        this.listFilters = this.listFilters.concat(newItem);
        console.log(this.listFilters);
        this.addedNewFilters = true;
    }

    removeFilter(event) {
        this.openPopover = false;
        var index = event.target.dataset.id;
        let remList = [];
        remList = this.listFilters;
        var key = Object.keys(remList)[index];
        var value = remList[key];
        console.log(value);
        let deleteditem = this.listFilters.splice(index, 1);
        console.log(deleteditem);

        /*console.log(event.currentTarget.getAttribute("data-id"));
        console.log(index);
        let remList = [];
        remList = this.listFilters;

        var key = Object.keys(remList)[index];
        var value = remList[key]
        console.log(key, value);
        console.log(remList);
        if (index >= 0) {
            array.splice(index, 1);
            reindex_array(array);
        }
        //var removedItem = remList.splice(index, 1);
        //console.log(removedItem);

        this.listFilters = remList;*/
        this.flterTrue = true;
    }

    removeAllFilters(event) {
        this.listFilters = [];
        this.flterTrue = true;

    }

    hanldeSelectedFilter(event) {
        this.openPopover = false;
        var selectedFilterData = event.detail;
        console.log(selectedFilterData);
        this.listFilters.forEach(function (record) {
            if (record.indx == selectedFilterData.indx) {
                record.Field_Name__c = selectedFilterData.selectedFilterfldOptions[0].label;
                record.Field_value__c = selectedFilterData.selectedFilterfldOptions[0].value;
                record.Field_Type__c = selectedFilterData.selectedFilterfldOptions[0].type;
                record.Operator_Label__c = selectedFilterData.selectedfilterOperatorOpts[0].label;
                record.Operator_value__c = selectedFilterData.selectedfilterOperatorOpts[0].value;
                record.Object_Name__c = selectedFilterData.selectedObject;
                record.openPopover = selectedFilterData.openPopover;
                record.Filter_Field_Value__c = selectedFilterData.filtervalue.join();
            }
        })
    }

    onfilterSave() {
        console.log('test', this.listFilters);
        this.flterTrue = false;
        onsaveFilters({
            selectedfilters: JSON.stringify(this.listFilters)
        })
            .then(result => {
                let index = 0;
                this.listFilters = result.map(row => {
                    let indx = index;
                    index++;
                    return { ...row, indx }
                })
                console.log(this.listFilters);
            })
            .catch(error => {
                this.error = error;
            });
    }

    onfilterCancel() {
        this.flterTrue = false;

    }
    @track selectedFilterField;
    @track selectedFilterOperator;
    @track selectedFiltervalue;
    
    onEditFilter() {
        var index = event.currentTarget.getAttribute("data-id");
        var key = Object.keys(this.listFilters)[index];
        var value = this.listFilters[key];
        console.log(value);
        value.openPopover = true;
        console.log(value);

    }



}