({
    init : function(cmp, event, helper) {
        // Figure out which buttons to display
        var availableActions = cmp.get('v.availableActions');
        for (var i = 0; i < availableActions.length; i++) {
            if (availableActions[i] == "PAUSE") {
                cmp.set("v.canPause", true);
            } else if (availableActions[i] == "BACK") {
                cmp.set("v.canBack", true);
            } else if (availableActions[i] == "NEXT") {
                cmp.set("v.canNext", true);
            } else if (availableActions[i] == "FINISH") {
                cmp.set("v.canFinish", true);
            }
        }
    },
    
    onButtonPressed: function(cmp, event, helper) {
        const selectedOptions = cmp.find("jobLocationMS").get("v.selectedOptions");//this will return an array of selected elements
        
        alert(JSON.stringify(selectedOptions));
        var al='';
        var i=0;
        for(var op in selectedOptions){
            console.log(op)
            if(i==0){
                al=al+selectedOptions[op].Name;
            }
            else{
                al=al+' ; '+selectedOptions[op].Name;
            }
            i=i+1;
            
        }
        console.log(al)
        cmp.set("v.AllergiesSelected",al);
        console.log('cmp.get("v.AllergiesSelected"'+cmp.get("v.AllergiesSelected"));
        // Figure out which action was called
        var actionClicked = event.getSource().getLocalId();
        alert(actionClicked);
        alert(cmp.get("v.Gender"));
        //if(cmp.get("v.LastName").length>4){
        // Fire that action
        
        var lstname = cmp.get("v.LastName");
        var fstname = cmp.get("v.FirstName");
        var dob = cmp.get("v.dob");
        if(lstname == '' || fstname ==''|| dob == ''){
            alert(lstname);
            alert(fstname);
            alert(dob);
            
        }
        var navigate = cmp.get("v.navigateFlow");
        navigate(actionClicked);
    },
    
    handlerHaveAllergies:function(component, event, helper) {
        console.log(component.get("v.haveAllergies"))
        if(component.get("v.haveAllergies") == "Yes"){
            component.set('v.SelectedHaveAllergies',true);
        }else{
            component.set("v.SelectedHaveAllergies",false);
        }
    },
    
    
    handleAllergiesoptions: function (cmp, event) {
        // This will contain an array of the "value" attribute of the selected options
        var selectedOptionValue = event.getParam("value");
        alert("Option selected with value: '" + selectedOptionValue.toString() + "'");
        console.log(selectedOptionValue.toString())
        cmp.set("v.AllergiesSelected", selectedOptionValue.toString());
    },
    
    PatientMobileChange:function(component, event, helper) {
        if(component.get("v.value") == "Yes"){
            component.set('v.blnPatientNumber',true);
        }else{
            component.set("v.blnPatientNumber",false);
        }
    },
    
    doAllergiesCheck: function(component, event, helper) {
        var val = component.find("alCheckbox").get("v.value");
        if(val == false){
            component.set("v.blnoa",true);
            component.set('v.blnotherallergies',true);
        }else{
            component.set("v.blnoa",false);
            component.set('v.blnotherallergies',false);
        }
    },
    onChange: function (cmp, event, helper) {
        var selectedOptionValue = event.getParam("value");
        alert('ddfs--->'+selectedOptionValue);
        alert( cmp.get("v.Gender"));
        
    }
    
    
})