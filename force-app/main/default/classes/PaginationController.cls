global with sharing class PaginationController {
    public static String SeprateFields='';
    Public static String strQuery='';
    Public static Integer noOfRecords{get; set;} 
    public static final Integer QUERY_LIMIT = 10000;
    public static Integer pageSize =5;
    public static Integer PageNumb;
    public static ApexPages.StandardSetController setCon;
    
    @AuraEnabled(cacheable = true) 
    global static List<PickListWrapper> getSobjects() {
        list<PickListWrapper> lstObjects = new list<PickListWrapper>();
        // Get the GlobalDescribe sobjects from the org
        map<string, SObjectType> objselect = schema.getGlobalDescribe();
        for(string ObjName :objselect.keySet()) {
            /* all the Sobjects to add to the array*/
            PickListWrapper objWrap = new PickListWrapper();
            objWrap.label = objselect.get(ObjName).getDescribe().getLabel();
            objWrap.value = string.valueOf(objselect.get(ObjName));
            lstObjects.add(objWrap);
        }
        system.debug(lstObjects);
        lstObjects.sort();
        return lstObjects;
    }
    
    @AuraEnabled(cacheable = true) 
    global static List<PickListWrapper> getFieldList(String selectedSobject) {
        List<PickListWrapper> LstobjectWrapper = new List<PickListWrapper>();
        // Get the GlobalDescribe sobjects from the org
        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        // Get the selected Sobject fields and labels
        Schema.SObjectType sObj = schemaMap.get(selectedSobject);
        Map<String, Schema.SObjectField> fieldMap = sObj.getDescribe().fields.getMap();
        system.debug(fieldMap.values());
        
        //add all the retrived fields of the selected sObject to the string
        for (String fieldName :fieldMap.keySet()) {
            PickListWrapper objWrap = new PickListWrapper();
            objWrap.label = fieldMap.get(fieldName).getDescribe().getLabel();
            objWrap.value = string.valueOf(fieldMap.get(fieldName));
            objWrap.type = string.valueOf(schema.getGlobalDescribe().get(selectedSobject).getDescribe().fields.getMap().get(fieldName).getDescribe().getType());
            LstobjectWrapper.add(objWrap);
        }
        LstobjectWrapper.sort();
        return LstobjectWrapper;
    }
    
    @AuraEnabled(cacheable = true) 
    global static recordsWrapper Getrecords(string selectedSobject, list<string> selectedpickList) {
        recordsWrapper ObjWrapper = new recordsWrapper();
        List<ObjectWrapper> LstobjectWrapper = new List<ObjectWrapper>();
        for(String fieldName :selectedpickList){
            ObjectWrapper objfieldsWrap = new ObjectWrapper();
            objfieldsWrap.label = schema.getGlobalDescribe().get(selectedSobject).getDescribe().fields.getMap().get(fieldName).getDescribe().getLabel();
            objfieldsWrap.fieldName = fieldName;
            objfieldsWrap.type = string.valueOf(schema.getGlobalDescribe().get(selectedSobject).getDescribe().fields.getMap().get(fieldName).getDescribe().getType());
            LstobjectWrapper.add(objfieldsWrap);
        }
        ObjWrapper.lstfields = LstobjectWrapper;
        SeprateFields = String.join(selectedpickList, ',');
        strQuery = 'Select '+ SeprateFields + ' from ' + selectedSobject + ' LIMIT '+ QUERY_LIMIT;
        
        ObjWrapper.strQury = strQuery;
        setcon = new ApexPages.StandardSetController(Database.getQueryLocator(strQuery));
        setCon.setPageSize(pageSize);  
        ObjWrapper.PageNumb = setCon.getPageNumber();
        ObjWrapper.pageSize = setCon.getPageSize();
        ObjWrapper.totalRecords = setCon.getResultSize();
        ObjWrapper.hasPervious = setCon.getHasPrevious();
        ObjWrapper.hasNext =setCon.getHasNext();
        ObjWrapper.lstData = setCon.getRecords();        
        return ObjWrapper;
    }
    
    @AuraEnabled(cacheable = true) 
    global static recordsWrapper getNextRecords(string strQuery,integer PageNumber,integer pageSize,sObject[] selectedRows){ 
        system.debug('test'+selectedRows);
        recordsWrapper ObjWrapper = new recordsWrapper();
        setcon = new ApexPages.StandardSetController(Database.getQueryLocator(strQuery));
        setCon.setPageSize(pageSize); 
        setCon.setpageNumber(PageNumber);
        setCon.setSelected(selectedRows);
        setCon.next();
        ObjWrapper.lstData = setCon.getRecords();
        ObjWrapper.strQury = strQuery;
        ObjWrapper.pageSize =setCon.getPageSize();
        ObjWrapper.PageNumb = setCon.getPageNumber(); 
        ObjWrapper.hasPervious = setCon.getHasPrevious();
        ObjWrapper.hasNext =setCon.getHasNext();
        ObjWrapper.selectedRecords = setCon.getSelected();

        return ObjWrapper;
    }
   
    
    @AuraEnabled(cacheable = true) 
    global static recordsWrapper getFirstRecords(string strQuery,integer PageNumber,integer pageSize,sObject[] selectedRows){ 
        
        recordsWrapper ObjWrapper = new recordsWrapper();
        setcon = new ApexPages.StandardSetController(Database.getQueryLocator(strQuery));
        setCon.setPageSize(pageSize); 
        setCon.setpageNumber(PageNumber);
        setCon.setSelected(selectedRows);
        setCon.first();
        ObjWrapper.lstData = setCon.getRecords();
        ObjWrapper.strQury = strQuery;
        ObjWrapper.pageSize =setCon.getPageSize();
        ObjWrapper.PageNumb = setCon.getPageNumber(); 
        ObjWrapper.hasPervious = setCon.getHasPrevious();
        ObjWrapper.hasNext =setCon.getHasNext();
        ObjWrapper.selectedRecords = setCon.getSelected();

        system.debug('test'+ObjWrapper);
        return ObjWrapper;
    }  
    
    @AuraEnabled(cacheable = true) 
    global static recordsWrapper getLastRecords(string strQuery,integer PageNumber,integer pageSize,sObject[] selectedRows){ 
        
        recordsWrapper ObjWrapper = new recordsWrapper();
        setcon = new ApexPages.StandardSetController(Database.getQueryLocator(strQuery));
        setCon.setPageSize(pageSize); 
        setCon.setpageNumber(PageNumber);
        setCon.setSelected(selectedRows);
        setCon.last();
        ObjWrapper.lstData = setCon.getRecords();
        ObjWrapper.strQury = strQuery;
        ObjWrapper.pageSize = setCon.getPageSize();
        ObjWrapper.PageNumb = setCon.getPageNumber(); 
        ObjWrapper.hasPervious = setCon.getHasPrevious();
        ObjWrapper.selectedRecords = setCon.getSelected();
        ObjWrapper.hasNext = setCon.getHasNext();
        return ObjWrapper;
    }  
    
    @AuraEnabled(cacheable = true) 
    global static recordsWrapper getPreviousRecords(string strQuery, Integer PageNumber, Integer pageSize,sObject[] selectedRows){ 
        
        recordsWrapper ObjWrapper = new recordsWrapper();
        setcon = new ApexPages.StandardSetController(Database.getQueryLocator(strQuery));
        setCon.setPageSize(pageSize); 
        setCon.setpageNumber(PageNumber);
        setCon.setSelected(selectedRows);
        setCon.previous();
        ObjWrapper.lstData = setCon.getRecords();
        ObjWrapper.strQury = strQuery;
        ObjWrapper.pageSize =setCon.getPageSize();
        ObjWrapper.PageNumb = setCon.getPageNumber();  
        ObjWrapper.hasPervious = setCon.getHasPrevious();
        ObjWrapper.hasNext =setCon.getHasNext();
        ObjWrapper.selectedRecords = setCon.getSelected();
        return ObjWrapper;
    }  
    @AuraEnabled(cacheable = true) 
    
    public static Map<string,string> getPicklistOptions(String objectApiName, String fieldApiName) {
        Map<string,string> mapPicklistOptions = new Map<string,string>();
        try {
            Schema.SObjectType obj_describe = Schema.getGlobalDescribe().get(objectApiName) ;
            Schema.DescribeSObjectResult obj_describe_result = obj_describe.getDescribe() ;
            Map<String,Schema.SObjectField> fields = obj_describe_result.fields.getMap() ;
            Schema.DescribeFieldResult fieldResult = fields.get(fieldApiName).getDescribe();
            List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
            for (Schema.PicklistEntry pickListVal : ple) {
                mapPicklistOptions.put(pickListVal.getLabel(),pickListVal.getValue());
            }
            
        } catch (Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
        system.debug('tye'+mapPicklistOptions);
        return mapPicklistOptions;
    }
    
    
    @AuraEnabled
    public static List<Filter__c> onsaveFilters(string selectedfilters) {
        system.debug('test'+selectedfilters);
        List<Filter__c>  lstfltr = new List<Filter__c>();
        List<Object> fieldList = (List<Object>)JSON.deserializeUntyped(selectedfilters);
        system.debug('test'+fieldList);

        Filter__c objFilter;
        for(Object fld : fieldList){ 
            system.debug('test'+fld);
            
            Map<String,Object> data = (Map<String,Object>)fld;
           // system.debug('test'+data.selectedObject);
            
            objFilter = new Filter__c();
            objFilter.Id = (string)data.get('Id');
            objFilter.Object_Name__c = (string)data.get('Object_Name__c');
            objFilter.Field_Name__c = (string)data.get('Field_Name__c');
            objFilter.Field_value__c = (string)data.get('Field_value__c');
            objFilter.Field_Type__c = (string)data.get('Field_Type__c');
            objFilter.Operator_Label__c = (string)data.get('Operator_Label__c');
            objFilter.Operator_value__c = (string)data.get('Operator_value__c');
            objFilter.Filter_Field_Value__c = (string)data.get('Filter_Field_Value__c');
            lstfltr.add(objFilter);
        } 
        if(!lstfltr.isEmpty()){
            system.debug('test'+lstfltr);
            upsert lstfltr;
        }
        return lstfltr;
    }
    
    @AuraEnabled(cacheable = true) 
    public static List<Filter__c> getFilters() {
        List<Filter__c>  lstfltr = [Select Id, Object_Name__c, Field_Name__c, Field_value__c,Field_Type__c,Operator_Label__c,
                                    Operator_value__c, Filter_Field_Value__c from Filter__c];
        return lstfltr;
    }
    
    
    global class PickListWrapper implements Comparable {
        
        @AuraEnabled
        public string label;
        @AuraEnabled
        public string value;
        @AuraEnabled
        public string type;
       
        
        global Integer compareTo(Object ObjToCompare) {
            return label.CompareTo(((PickListWrapper)ObjToCompare).label);
        }
    }
    
    global class ObjectWrapper {
        
        @AuraEnabled
        public string label;
        @AuraEnabled
        public string fieldName;
        @AuraEnabled
        public string type;
        @AuraEnabled
        public boolean editable;
        @AuraEnabled
        public boolean sortable;
        
        public ObjectWrapper(){
            editable = true;
            sortable = true;
        }  
    }
    
    global class recordsWrapper {
        
        @AuraEnabled
        public List<SObject> lstData;
        @AuraEnabled
        public List<ObjectWrapper> lstfields;
        @AuraEnabled
        public string strQury;
        @AuraEnabled
        public Integer PageNumb;
        @AuraEnabled
        public Integer totalRecords;
        @AuraEnabled
        public Integer pageSize;
        @AuraEnabled
        public Integer currentPage;
        @AuraEnabled
        public Boolean hasPervious;
        @AuraEnabled
        public Boolean hasNext;
        @AuraEnabled
        public sObject[] selectedRecords;
        
    }
}