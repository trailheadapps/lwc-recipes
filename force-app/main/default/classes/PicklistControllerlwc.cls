global class PicklistControllerlwc {
    public static String SeprateFields='';
    Public static String strQuery='';
    public static final Integer QUERY_LIMIT = 10000;
    public static Integer pageSize = 3;
    public static ApexPages.StandardSetController setCon;
    
    @AuraEnabled(cacheable = true) 
    global static List<WrapperClass.PickListWrapper> getSobjects() {
        list<WrapperClass.PickListWrapper> lstObjects = new list<WrapperClass.PickListWrapper>();
        // Get the GlobalDescribe sobjects from the org
        map<string, SObjectType> objselect = schema.getGlobalDescribe();
        for(string ObjName :objselect.keySet()) {
            /* all the Sobjects to add to the array*/
            WrapperClass.PickListWrapper objWrap = new WrapperClass.PickListWrapper();
            objWrap.label = objselect.get(ObjName).getDescribe().getLabel();
            objWrap.value = string.valueOf(objselect.get(ObjName));
            lstObjects.add(objWrap);
        }
        system.debug(lstObjects);
        lstObjects.sort();
        return lstObjects;
    }
    
    @AuraEnabled(cacheable = true) 
    global static List<WrapperClass.PickListWrapper> getFieldList(String selectedSobject) {
        List<WrapperClass.PickListWrapper> LstobjectWrapper = new List<WrapperClass.PickListWrapper>();
        // Get the GlobalDescribe sobjects from the org
        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        // Get the selected Sobject fields and labels
        Schema.SObjectType sObj = schemaMap.get(selectedSobject);
        Map<String, Schema.SObjectField> fieldMap = sObj.getDescribe().fields.getMap();
        system.debug(fieldMap.values());
        
        //add all the retrived fields of the selected sObject to the string
        for (String fieldName :fieldMap.keySet()) {
            WrapperClass.PickListWrapper objWrap = new WrapperClass.PickListWrapper();
            objWrap.label = fieldMap.get(fieldName).getDescribe().getLabel();
            objWrap.value = string.valueOf(fieldMap.get(fieldName));
            LstobjectWrapper.add(objWrap);
        }
        LstobjectWrapper.sort();
        return LstobjectWrapper;
    }
    
    @AuraEnabled(cacheable = true) 
    global static WrapperClass.recordsWrapper Getrecords(string selectedSobject,list<string> selectedpickList) {
        WrapperClass.recordsWrapper ObjWrapper = new WrapperClass.recordsWrapper();
        List<WrapperClass.ObjectWrapper> LstobjectWrapper = new List<WrapperClass.ObjectWrapper>();
        for(String fieldName :selectedpickList){
            WrapperClass.ObjectWrapper objfieldsWrap = new WrapperClass.ObjectWrapper();
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
    global static WrapperClass.recordsWrapper getNextRecords(string strQuery,integer PageNumber,integer pageSize, List<SObject> selectedRows){ 
        
        WrapperClass.recordsWrapper ObjWrapper = new WrapperClass.recordsWrapper();
        setcon = new ApexPages.StandardSetController(Database.getQueryLocator(strQuery));
        setCon.setPageSize(pageSize); 
        setCon.setpageNumber(PageNumber);
        if(!selectedRows.IsEmpty()){setCon.setSelected(selectedRows);}
        setCon.next();
        ObjWrapper.lstData = setCon.getRecords();
        ObjWrapper.strQury = strQuery;
        ObjWrapper.pageSize =setCon.getPageSize();
        ObjWrapper.PageNumb = setCon.getPageNumber(); 
        ObjWrapper.selected = setCon.getSelected();        
        ObjWrapper.hasPervious = setCon.getHasPrevious();
        ObjWrapper.hasNext =setCon.getHasNext();
        return ObjWrapper;
    }  
    
    @AuraEnabled(cacheable = true) 
    global static WrapperClass.recordsWrapper getFirstRecords(string strQuery,integer PageNumber,integer pageSize){ 
        
        WrapperClass.recordsWrapper ObjWrapper = new WrapperClass.recordsWrapper();
        setcon = new ApexPages.StandardSetController(Database.getQueryLocator(strQuery));
        setCon.setPageSize(pageSize); 
        setCon.setpageNumber(PageNumber);
        setCon.first();
        ObjWrapper.lstData = setCon.getRecords();
        ObjWrapper.strQury = strQuery;
        ObjWrapper.pageSize =setCon.getPageSize();
        ObjWrapper.PageNumb = setCon.getPageNumber(); 
        ObjWrapper.hasPervious = setCon.getHasPrevious();
        ObjWrapper.hasNext =setCon.getHasNext();
        system.debug('test'+ObjWrapper);
        return ObjWrapper;
    }  
    
    @AuraEnabled(cacheable = true) 
    global static WrapperClass.recordsWrapper getLastRecords(string strQuery,integer PageNumber,integer pageSize){ 
        
        WrapperClass.recordsWrapper ObjWrapper = new WrapperClass.recordsWrapper();
        setcon = new ApexPages.StandardSetController(Database.getQueryLocator(strQuery));
        setCon.setPageSize(pageSize); 
        setCon.setpageNumber(PageNumber);
        setCon.last();
        ObjWrapper.lstData = setCon.getRecords();
        ObjWrapper.strQury = strQuery;
        ObjWrapper.pageSize = setCon.getPageSize();
        ObjWrapper.PageNumb = setCon.getPageNumber(); 
        ObjWrapper.hasPervious = setCon.getHasPrevious();
        ObjWrapper.hasNext = setCon.getHasNext();
        return ObjWrapper;
    }  
    
    @AuraEnabled(cacheable = true) 
    global static WrapperClass.recordsWrapper getPreviousRecords(string strQuery, Integer PageNumber, Integer pageSize, List<SObject> selectedRows){ 
        
        WrapperClass.recordsWrapper ObjWrapper = new WrapperClass.recordsWrapper();
        setcon = new ApexPages.StandardSetController(Database.getQueryLocator(strQuery));
        setCon.setPageSize(pageSize); 
        setCon.setpageNumber(PageNumber);
        if(!selectedRows.IsEmpty()){setCon.setSelected(selectedRows);}
        setCon.previous();
        ObjWrapper.lstData = setCon.getRecords();
        ObjWrapper.strQury = strQuery;
        ObjWrapper.pageSize =setCon.getPageSize();
        ObjWrapper.PageNumb = setCon.getPageNumber();  
        ObjWrapper.hasPervious = setCon.getHasPrevious();
        ObjWrapper.hasNext =setCon.getHasNext();
        ObjWrapper.selected = setCon.getSelected();
        return ObjWrapper;
    }  
}