import { LightningElement } from 'lwc';

export default class LightDomQueryChild extends LightningElement {
    static renderMode = 'light';

    handleButtonClick() {
        // Within Light DOM components, use this.querySelector instead of this.template.querySelector to access elements
        this.querySelector('p.lightDomParagraph').innerText =
            'Text changed by child';
    }
}
