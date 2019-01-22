import { LightningElement, track } from 'lwc';

export default class TextEntry extends LightningElement {
    @track body;
    @track charsLeft = 160;

    inputChange(event){
        this.body = event.target.name;
        this.charsLeft = 160 - this.body.length;

    }
}