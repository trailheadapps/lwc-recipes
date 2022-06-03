import { LightningElement } from 'lwc';

export default class LightDomQuery extends LightningElement {
    handleButtonClick() {
        // Elements that are inside a Light DOM child component are directly accessible by the parent
        this.template.querySelector('p.lightDomParagraph').innerText =
            'Text changed by parent';
    }
}
