import { LightningElement, api, track } from 'lwc';
import getPicklistValues from '@salesforce/apex/PaginationController.getPicklistOptions';



export default class LwcPopovers extends LightningElement {
    @api options;
    @api selectedobject;
    @api keyvalue;
    @api key;
    @api popover; filterOperator
    @track FilterField;
    @track filterOptions = [];
    @track filterValueOptions = [];
    @track filterOperatorOpts = [];
    @track selectedFilterField = '';
    @track selectedFilterOperatorlabel = '';
    @track selectedFilterOperatorvalue = '';
    @track selectedFilterValue = '';
    @track picklistflterOptions = false;

    constructor() {
        super();

        this.filterOperatorOpts.push({
            label: 'equals',
            value: '=',
        });
        this.filterOperatorOpts.push({
            label: 'not equal to',
            value: '!=',
        })
        this.filterOperatorOpts.push({
            label: 'less than',
            value: '<',
        })
        this.filterOperatorOpts.push({
            label: 'greater than',
            value: '>',
        })
        this.filterOperatorOpts.push({
            label: 'less or equal',
            value: '<=',
        })
        this.filterOperatorOpts.push({
            label: 'greater equal',
            value: '>=',
        })
        this.filterOperatorOpts.push({
            label: 'contains',
            value: 'like',
        })
        this.filterOperatorOpts.push({
            label: 'does not contain',
            value: 'notnlike',
        })
        this.filterOperatorOpts.push({
            label: 'starts with',
            value: 'startswith',
        })

        this.selectedFilterOperatorvalue = this.filterOperatorOpts[0].value;
    }

    renderedCallback() {
      //  this.FilterField = this.options[3].value;
    }

    get checkfilterOptions() {
        return this.filterValueOptions.length > 0 ? true : false;

    }

    onClickFilterField(event) {
        var value = event.detail.value;
        var selectedFiltertmp = this.options.filter(function (option) {
            return option.value == value;
        });
        if (selectedFiltertmp[0].type == 'PICKLIST') {
            getPicklistValues({
                objectApiName: this.selectedobject,
                fieldApiName: selectedFiltertmp[0].value
            })
                .then(result => {
                    for (let key in result) {
                        // Preventing unexcepted data
                        if (result.hasOwnProperty(key)) { // Filtering the data in the loop
                            this.filterValueOptions.push({ Name: result[key], Id: key, selected: false });
                            this.picklistflterOptions = true;

                        }
                    }
                })
                .catch(error => {
                    this.error = error;
                });
        }
    }

    onChangeFilterValue(event) {
        this.selectedFilterValue = event.detail.value;

    }

    onchangeInputValue(event) {
        this.selectedFilterValue = event.target.value;
    }

    onsaveFilter() {

        var filterFieldName = this.template.querySelector('[data-id="filterFieldId"]').value;
        var filterOptor = this.template.querySelector('[data-id="filterOperatorId"]').value;

        let selectedFilterfldOptions = this.options.filter(function (option) {
            return option.value == filterFieldName;
        });

        let selectedfilterOperatorOpts = this.filterOperatorOpts.filter(function (option) {
            return option.value == filterOptor;
        });

        var selectedFilter = {
            indx: this.keyvalue,
            selectedFilterfldOptions: selectedFilterfldOptions,
            selectedfilterOperatorOpts: selectedfilterOperatorOpts,
            filtervalue: this.getSelectedPicklist(),//this.template.querySelector('[data-id="filtervalue"]').value,
            selectedObject: this.selectedobject,
            openPopover: false
        }

        const selectEvent = new CustomEvent('mycustomevent', {
            detail: selectedFilter
        });
        this.dispatchEvent(selectEvent);

    }

    get getfilterValueOptions() {
        return this.filterValueOptions.length > 0 ? true : false;
    }


    onclickinput() {
        console.log('test')
    }

    @track iconName;
    @track selectedPicklist = [];

    handleselecteditem(event) {
        let foundelement = this.filterValueOptions.find(ele => ele.Name === event.target.dataset.id);
        if (!foundelement.selected) {
            foundelement.selected = true;
        } else {
            foundelement.selected = false;
        }
        this.filterValueOptions = [...this.filterValueOptions];

    }
    getSelectedPicklist(event) {
        this.filterValueOptions.forEach(element => {
            if (element.selected) {
                this.selectedPicklist.push(element.Id);
            }
        });
        console.log(this.selectedPicklist)
        return this.selectedPicklist;
    }

}