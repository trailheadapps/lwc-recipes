global class WrapperClass {
    
    global class PickListWrapper implements Comparable {
        
        @AuraEnabled
        public string label;
        @AuraEnabled
        public string value;
        
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
        public sObject[] selected;
        @AuraEnabled
        public Integer currentPage;
        @AuraEnabled
        public Boolean hasPervious;
        @AuraEnabled
        public Boolean hasNext;
        
    }
}