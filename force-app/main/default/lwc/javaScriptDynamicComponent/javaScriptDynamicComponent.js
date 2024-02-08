import { LightningElement } from 'lwc';

const MAPPING = {
    full: () => import('c/contactTile'),
    lite: () => import('c/contactTileLite')
};

export default class JavaScriptDynamicComponent extends LightningElement {
    componentConstructor;
    value = 'lite';

    contact = {
        Name: 'Amy Taylor',
        Title: 'VP of Engineering',
        Phone: '6172559632',
        Picture__c:
            'https://s3-us-west-2.amazonaws.com/dev-or-devrl-s3-bucket/sample-apps/people/amy_taylor.jpg'
    };

    connectedCallback() {
        this.assignConstructor();
    }

    get options() {
        return [
            { label: 'Lite', value: 'lite' },
            { label: 'Full', value: 'full' }
        ];
    }

    handleChange(event) {
        this.value = event.target.value;
        this.assignConstructor();
    }

    assignConstructor() {
        MAPPING[this.value]().then(({ default: SelectedConstructor }) => {
            this.componentConstructor = SelectedConstructor;
        });
    }
}
