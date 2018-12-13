import { LightningElement } from 'lwc';

export default class ApiFunction extends LightningElement {
    handleRefresh() {
        this.template.querySelector('c-clock').refresh();
    }
}
