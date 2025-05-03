import { LightningElement, track, api, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import fetchRelatedListRecords from '@salesforce/apex/ContactRolesController.fetchRelatedListRecords';
import { gql, graphql, refreshGraphQL } from 'lightning/uiGraphQLApi';
import upsertRoles from '@salesforce/apex/ContactRolesController.upsertContactRoles';
import CONTACT_ROLE_OBJECT from '@salesforce/schema/OpportunityContactRole';
import ROLE_FIELD from '@salesforce/schema/OpportunityContactRole.Role';
import EditContactRole from '@salesforce/label/c.Edit_Contact_Roles';
import AddRow from '@salesforce/label/c.add';
import ToastErrorTitle from '@salesforce/label/c.error-occur';
import ToastSuccessTitle from '@salesforce/label/c.success-msg';
import Cancel from '@salesforce/label/c.Cancel';
import SaveAndClose from '@salesforce/label/c.save';

import {
    NavigationMixin
} from 'lightning/navigation';
import {
    CloseActionScreenEvent
} from 'lightning/actions';
import {
    getObjectInfo,
    getPicklistValues
} from 'lightning/uiObjectInfoApi';
import {
    masterRecordTypeId
} from './utils.js';
import {
    showToast
} from 'c/toastMessageUtil'; //Display Toast Message from generic component
const columns = [{
    label: 'Name',
    fieldName: 'Name',
    title: 'Name',
    type: 'lookup',
    editable: false,
    typeAttributes: {
        placeholder: 'Choose Contact',
        object: 'OpportunityContactRole',
        fieldName: 'ContactId',
        label: 'Contact',
        value: {
            fieldName: 'ContactId'
        },
        context: {
            fieldName: 'Id'
        },
        variant: 'label-hidden',
        name: 'Contact',
        fields: ['Contact.Name'],
        target: '_self'
    }
},
{
    label: 'Role',
    fieldName: 'Role',
    type: 'picklist',
    editable: false,
    typeAttributes: {
        placeholder: 'Choose Role',
        options: {
            fieldName: 'pickListOptions'
        },
        value: {
            fieldName: 'Role'
        },
        context: {
            fieldName: 'Id'
        },
        label: 'Role',
        variant: 'label-hidden',
        name: 'Role'
    }
}
]

export default class EditContactRoles extends NavigationMixin(LightningElement) {
    timeoutId;
    @api recordId; //Fetch Opportunity Id and based on this, OpportunityContactRole info fetches
    @api mode;
    recordTypeIdRole = '';
    keyIndex = 0;
    contacts;
    selectedContacts;
    primaryContactRoleToBeInserted;
    otherContactRolesToBeInserted;
    preSelectedRows = ["NA"];
    error;
    columns = columns;
    datas = [];
    @track dataPickist = [];
    draftValues = [];
    lastSavedData = [];
    @track pickListOptions;
    @track contactDataList;
    //used to obtain the picklist as private children of datatable
    privateChildren = {};
    callWire = false;
    userPermissionsArray = [];
    label = {
        EditContactRole,
        ToastErrorTitle,
        ToastSuccessTitle,
        SaveAndClose,
        Cancel,
        AddRow
    };
    @track wiredActivity = [];
    showSpinner = false;
    spinnerVariant = 'brand';
    spinnerMessage = 'Loading..';
    _timeout;
    graphqlData;
    url;
    opportunityURL;
    @wire(getObjectInfo, {
        objectApiName: CONTACT_ROLE_OBJECT
    })
    objectInfo;

    //fetch picklist options
    @wire(getPicklistValues, {
        recordTypeId: masterRecordTypeId,
        fieldApiName: ROLE_FIELD
    })
    wirePickList({
        error,
        data
    }) {
        if (data) {
            this.pickListOptions = data.values;
            this.callWire = true;
        } else if (error) {
            console.log(error);
        }
    }
    constructor() {
        super();
    }

    handleAddRow() {
        let copyData = this.datas;
        copyData.push({
            Id: this.keyIndex,
            OpportunityId: this.recordId,
            ContactId: null,
            IsPrimary: false,
            Role: null,
            Name: null,
            conLink: null,
            pickListOptions: this.pickListOptions,
            roleClass: 'slds-cell-edit',
            contactNameClass: 'slds-cell-edit'
        });
        this.keyIndex = this.keyIndex + 1;
        this.datas = [...copyData];
        //refreshApex(this.datas);
    }


    closeAction() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }



    updateDataValues(updateItem) {
        let copyData = JSON.parse(JSON.stringify(this.datas));

        copyData.forEach(item => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];
                }
            }
        });

        //write changes back to original data
        this.datas = [...copyData];
    }

    updateDraftValues(updateItem) {
        let draftValueChanged = false;
        let copyDraftValues = JSON.parse(JSON.stringify(this.draftValues));
        //store changed value to do operations
        //on save. This will enable inline editing &
        //show standard cancel & save button
        copyDraftValues.forEach(item => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];
                }
                draftValueChanged = true;
            }
        });

        if (draftValueChanged) {
            this.draftValues = [...copyDraftValues];
        } else {
            this.draftValues = [...copyDraftValues, updateItem];
        }
    }

    //handler to handle cell changes & update values in draft values
    handleCellChange(event) {
        event.preventDefault();
        this.updateDraftValues(event.detail.draftValues[0]);
    }



    handleRowSelection(event) {
        var selectedRecords = this.template.querySelector("c-l-w-c-lookup-custom-datatable").getSelectedRows();
        event.stopPropagation();
        let updatedItem;
        if (selectedRecords[0] && selectedRecords[0].Id) {
            updatedItem = {
                Id: selectedRecords[0].Id,
                IsPrimary: true
            };
            this.updateDraftValues(updatedItem);
            this.updateDataValues(updatedItem);
        }
    }

    handleValueChange(event) {
        event.stopPropagation();
        let dataRecieved = event.detail.data;
        let updatedItem;
        if (dataRecieved.label == 'Role') {
            updatedItem = {
                Id: dataRecieved.context,
                Role: dataRecieved.value
            };
            this.setClasses(dataRecieved.context, 'roleClass', 'slds-cell-edit slds-is-edited');
        } else if (dataRecieved.label == 'Contact') {
            updatedItem = {
                Id: dataRecieved.context,
                ContactId: dataRecieved.value
            };
            this.setClasses(dataRecieved.context, 'contactNameClass', 'slds-cell-edit slds-is-edited');
        } else {
            this.setClasses(dataRecieved.context, '', '');
        }
        this.updateDraftValues(updatedItem);
        this.updateDataValues(updatedItem);
    }

    handleEdit(event) {
        event.preventDefault();
        let dataRecieved = event.detail.data;
        if (dataRecieved.label === 'Role' || dataRecieved.label === 'Contact') {
            this.setClasses(dataRecieved.context, 'roleClass', 'slds-cell-edit');
        } else {
            this.setClasses(dataRecieved.context, '', '');
        }
    }


    setClasses(id, fieldName, fieldValue) {
        this.datas = JSON.parse(JSON.stringify(this.datas));
        this.datas.forEach((detail) => {
            if (detail.Id === id) {
                detail[fieldName] = fieldValue;
            }
        });
    }

    handleSave(event) {
        console.log('Calling handlesave..');
        event.preventDefault();
        this.showSpinners();
        this.showTable = false;
        const updatedFields = this.draftValues;
        const oppId = this.recordId;
        let copyData = this.datas;
        this.datas = [...copyData];
        // Call upsertRoles and refreshApex with Promise chaining
        upsertRoles({
            rolesforUpdate: updatedFields,
            oppId: oppId
        })
            .then(() => {
                this.dispatchEvent(
                    showToast('success', 'dismissable', '', this.label.ToastSuccessTitle)
                );
                this.hideSpinner();
                //Once Update Navigate to Parent Record detail page.
                window.clearTimeout(this._timeout);
                this._timeout = setTimeout(() => {
                    this.navigateToRecord();
                }, 2000);

            }).catch((error) => {
                this.dispatchEvent(
                    showToast('error', 'dismissable', '', this.label.ToastErrorTitle)
                );
                console.log('error:', error);
                this.hideSpinner();
            })


    }
    handleCancel(event) {
        //remove draftValues & revert data changes
        this.datas = JSON.parse(JSON.stringify(this.lastSavedData));
        this.draftValues = [];
    }

    navigateToRecord() {
        this.opportunityURL = this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                actionName: 'view'
            }
        });
        this[NavigationMixin.GenerateUrl](this.opportunityURL)
            .then(url => this.url = url);
    }
    //Graph  QL to fetch data
    @wire(graphql, {
        query: "$contactRoleQuery",
        variables: "$queryData",
    })
    graphqlQueryResult({
        data,
        errors
    }) {
        console.log('graphqlData.' + JSON.stringify(this.datas));
        if (data) {
            console.log('Wire called.');
            this.wiredActivity = [];
            this.wiredActivity = data.uiapi.query.OpportunityContactRole.edges.map(edge => edge.node);
            this.datas = [];
            if (this.wiredActivity !== undefined) {
                this.wiredActivity.map((row) => {
                    if (row.IsPrimary) {
                        this.preSelectedRows = [];
                        this.preSelectedRows.push(row.Id);
                    }
                    this.datas.push({
                        Id: row.Id,
                        OpportunityId: row.OpportunityId.value,
                        ContactId: row.ContactId.value,
                        IsPrimary: row.IsPrimary.value,
                        Role: row.Role.value,
                        Name: row.Contact.Name.value,
                        conLink: '/' + row.ContactId.value,
                        pickListOptions: this.pickListOptions,
                        roleClass: 'slds-cell-edit',
                        contactNameClass: 'slds-cell-edit'
                    });
                });
                this.graphqlData = this.datas;
            }

            this.error = undefined;
        } else if (errors) {
            console.log('Errors in Wire Graph QL..' + JSON.stringify(errors));
        }
    }
    get contactRoleQuery() {
        return gql`
      query contactRoleDetails($oppId: ID!) {
        uiapi {
          query {
            OpportunityContactRole(where: { 
            OpportunityId: { eq: $oppId },
            }) {
              edges {
                node {
                  Id
                  ContactId{value}
                  OpportunityId{value}
                  Role{value}
                  IsPrimary{value}
                  Contact{
                  Name{value}
                  }
                }
              }
            }
          }
        }
      }
    `;
    }
    get queryData() {
        return {
            oppId: this.recordId
        };
    }
    // try to call refresh button on button click or after save button event but does not work.
    async refresh() {
        console.log('Calling refresh...');
        try {
            return refreshGraphQL(this.datas);
        }
        catch (err) {
            console.log('Error during refresh' + JSON.stringify(err));
        }

    }
    get isVisible() {
        return this.datas.length > 0 ? true : false;
    }
    showSpinners() {
        this.spinnerMessage = 'Saving..';
        this.spinnerVariant = 'brand';
        this.showSpinner = true;
    }
    hideSpinner() {
        window.clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
            this.showSpinner = false;
        }, 1200);
    }

    get changeData() {
        return this.datas.length > 0 ? this.datas : undefined
    }
}