public class ContactDriveQueueable implements Queueable, Database.AllowsCallouts {
    private String wrapperJSON;

    public ContactDriveQueueable(String json) {
        this.wrapperJSON = json;
    }

    public void execute(QueueableContext qc) {
        ContactDriveWrapper w = (ContactDriveWrapper) JSON.deserialize(wrapperJSON, ContactDriveWrapper.class);

        String contentJson = JSON.serialize(new Map<String, Object>{
            'Id' => w.recordId,
            'FirstName' => w.firstName,
            'LastName' => w.lastName,
            'Email' => w.email,
            'Phone' => w.phone,
            'CreatedDate' => w.createdDate,
            'BackupCreatedAt' => System.now()
        });

        String boundary = 'driveBoundary987';
        String metaJson = JSON.serialize(new Map<String, Object>{
            'name' => 'Contact_' + w.recordId + '.json',
            'parents' => new List<String>{ '13SALc13VSgQ3lyc0MktZwWUfILwhE9nb' }
        });

        String multipartBody =
            '--' + boundary + '\n' +
            'Content-Type: application/json; charset=UTF-8\n\n' +
            metaJson + '\n' +
            '--' + boundary + '\n' +
            'Content-Type: application/json\n\n' +
            contentJson + '\n' +
            '--' + boundary + '--';

        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:Google_Drive_OAuth2/upload/drive/v3/files?uploadType=multipart');
        req.setMethod('POST');
        req.setHeader('Content-Type', 'multipart/related; boundary=' + boundary);
        req.setBody(multipartBody);

        new Http().send(req);
    }
}