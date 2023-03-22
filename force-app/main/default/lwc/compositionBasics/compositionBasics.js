import { LightningElement } from 'lwc';

export default class CompositionParent extends LightningElement {
    contact = {
        Name: 'Amy Taylor',
        Title: 'VP of Engineering',
        Phone: '6172559632',
        Picture__c:
            'https://s3-us-west-2.amazonaws.com/dev-or-devrl-s3-bucket/sample-apps/people/amy_taylor.jpg'
    };
}
