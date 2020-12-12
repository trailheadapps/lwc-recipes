({
    doInit : function(component, event, helper) {
        var doc = new jsPDF();
        doc.setFontSize(40);
        doc.text(35, 25, 'Paranyan loves jsPDF');
    }
})