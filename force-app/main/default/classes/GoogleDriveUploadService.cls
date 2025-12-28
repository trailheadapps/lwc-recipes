public with sharing class GoogleDriveUploadService {

    @InvocableMethod(label='Upload Contact Wrapper to Google Drive' description='Accepts Contact data from Flow as JSON string and uploads to Google Drive')
    public static void uploadContactToDrive(List<String> jsonWrapperList) {
        if (jsonWrapperList == null || jsonWrapperList.isEmpty()) return;

        // Deserialize JSON into your wrapper
        ContactDriveWrapper w = (ContactDriveWrapper) JSON.deserialize(jsonWrapperList[0], ContactDriveWrapper.class);

        System.enqueueJob(new ContactDriveQueueable(JSON.serialize(w)));
    }
}