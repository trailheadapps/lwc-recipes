import { LightningElement, track } from 'lwc';

export default class TextEntry extends LightningElement {
    @track charsLeft = 160;

    inputChange(event){
        var bodyInput = event.target.name;
        this.charsLeft = 160 - bodyInput.length;
    }
}