import { LightningElement, track } from 'lwc';

export default class TextEntry extends LightningElement {
    @track textInput;
    @track charsLeft = 160;

    inputChange(event){
        this.textInput = event.target.value;
        this.charsLeft = 160 - this.textInput.length;
    }
    clearInput(){
        this.textInput = '';
    }

}