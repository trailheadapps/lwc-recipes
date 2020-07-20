import { LightningElement } from 'lwc';
import getScoreList from '@salesforce/apex/ExamScoreCalculatorController.getScoreList';

export default class ExamScoreCalculatorApexImperativeMethod extends LightningElement {
    scores;
    error;

    handleLoad() {
        getScoreList()
            .then((result) => {
                this.scores = result;
                this.error = undefined;
            })
            .catch((error) => {
                this.error = error;
                this.scores = undefined;
            });
    }
}