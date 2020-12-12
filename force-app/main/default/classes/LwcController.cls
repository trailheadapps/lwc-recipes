public with sharing class LwcController {
    @AuraEnabled(cacheable = true) 
    public static List<ObjectsWrapper> getSobjects() {
        list<ObjectsWrapper> lstObjects = new list<ObjectsWrapper>();
        // Get the GlobalDescribe sobjects from the org
        map<string, SObjectType> objselect = schema.getGlobalDescribe();
        List<string> sorted = new List<string>();
        sorted.addall(objselect.keySet());
        sorted.sort();
        for(string ObjName :sorted) {
            /* all the Sobjects to add to the array*/
            ObjectsWrapper objWrap = new ObjectsWrapper();
            objWrap.strObjlabel = objselect.get(ObjName).getDescribe().getLabel();
            objWrap.strObjApiName = string.valueOf(objselect.get(ObjName));
            lstObjects.add(objWrap);
        }
        system.debug(lstObjects);
        return lstObjects;
    }
    @AuraEnabled(cacheable = true) 
    public static List<FieldsWrapper> getFieldList(String selectedSobject) {
        List<FieldsWrapper> LstFieldsWrapper = new List<FieldsWrapper>();
        // Get the GlobalDescribe sobjects from the org
        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        // Get the selected Sobject fields and labels
        Schema.SObjectType sObj = schemaMap.get(selectedSobject);
        Map<String, Schema.SObjectField> fieldMap = sObj.getDescribe().fields.getMap();
        system.debug(fieldMap);
        //add all the retrived fields of the selected sObject to the string
        for (String fieldName :fieldMap.keySet()) {
            FieldsWrapper objWrap = new FieldsWrapper();
            objWrap.strFieldlabel = fieldMap.get(fieldName).getDescribe().getLabel();
            objWrap.strFieldApiName = string.valueOf(fieldMap.get(fieldName));
            //allFields.add(fieldMap.get(fieldName).getDescribe().getLabel());
            LstFieldsWrapper.add(objWrap);
        }
        return LstFieldsWrapper;
    }
    
    @AuraEnabled(cacheable = true) 
    public static recordsWrapper Getrecords(string selectedSobject,list<string> selectedpickList) {
        system.debug('test'+selectedpickList);
        recordsWrapper ObjWrapper = new recordsWrapper();
        List<FieldsWrapper> LstFieldsWrapper = new List<FieldsWrapper>();
        for(String fieldName :selectedpickList){
            FieldsWrapper objfieldsWrap = new FieldsWrapper();
            objfieldsWrap.strFieldlabel = schema.getGlobalDescribe().get(selectedSobject).getDescribe().fields.getMap().get(fieldName).getDescribe().getLabel();
            objfieldsWrap.strFieldApiName = fieldName;
            LstFieldsWrapper.add(objfieldsWrap);
        }
        ObjWrapper.lstfields = LstFieldsWrapper;
        list<sObject> lstrecords = null;
        String SeprateFields = '';
        String query = '';
        String SobjectApiName = selectedSobject;
        SeprateFields = String.join(selectedpickList, ',');
        query = 'Select '+ SeprateFields + ' from ' + selectedSobject;
        system.debug('test'+query);
        lstrecords = Database.Query(query);
        ObjWrapper.lstData = lstrecords;
        return ObjWrapper;
    }
    public class ObjectsWrapper {
        @AuraEnabled
        public string strObjlabel;
        @AuraEnabled
        public string strObjApiName;
    }
    public class FieldsWrapper {
        @AuraEnabled
        public string strFieldlabel;
        @AuraEnabled
        public string strFieldApiName;
    }
    public class recordsWrapper {
        @AuraEnabled
        public List<Sobject> lstData;
        @AuraEnabled
        public List<FieldsWrapper> lstfields;
        
    }
}