public with sharing class PDFGenerator
{
    
   /* public static final String FORM_HTML_START = '<HTML><BODY>';
    public static final String FORM_HTML_END = '</BODY></HTML>';

    public static void generateAccountPDF(Payment__c payment)
    {
        
        for(Payment__c p:[select id, name,TransactionStatus__c from payment__c where id=:payment.id]){
                String pdfContent = '' + FORM_HTML_START;
        try
        {
            pdfContent = '' + FORM_HTML_START;
            pdfContent = pdfContent + '<H2>Account Information in PDF</H2>';
            pdfContent = pdfContent + '<P>' + 'Mayank' + ': ' + p.name + '</P>';
            pdfContent = pdfContent + '<P>' + 'Sharma' + ': ' + p.TransactionStatus__c + '</P>';
            pdfContent = pdfContent + FORM_HTML_END;
        }catch(Exception e)
        {
            pdfContent = '' + FORM_HTML_START;
            pdfContent = pdfContent + '<P>THERE WAS AN ERROR GENERATING PDF: ' + e.getMessage() + '</P>';
            pdfContent = pdfContent + FORM_HTML_END;
        }
        attachPDF(payment,pdfContent);
            
        }
        
        
    }
    
    public static void attachPDF(Payment__c payment, String pdfContent)
    {
        try
        {
            Attachment attachmentPDF = new Attachment();
            attachmentPDF.parentId = payment.Id;
            attachmentPDF.Name = payment.Name + '.pdf';
            attachmentPDF.body = Blob.toPDF(pdfContent); //This creates the PDF content
            insert attachmentPDF;
        }catch(Exception e)
        {
            payment.addError(e.getMessage());
        }
    }
    */
}