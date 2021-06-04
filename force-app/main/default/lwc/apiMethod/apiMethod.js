import { LightningElement } from 'lwc';

export default class ApiMethod extends LightningElement {
    handleRefresh() {
        this.template.querySelector('c-clock').refresh();
    }
}
