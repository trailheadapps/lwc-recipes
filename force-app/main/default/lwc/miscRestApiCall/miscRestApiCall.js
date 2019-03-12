import { LightningElement, track } from 'lwc';

// The base URL (in this case https://www.googleapis.com/ must be added to the CSP Trusted Sites in Setup)
const QUERY_URL = 'https://www.googleapis.com/books/v1/volumes?q=';

export default class MiscRestCall extends LightningElement {

    @track searchKey = 'Harry Potter';
    @track books;
    @track error;

    handleSearchKeyChange(event) {
        this.searchKey = event.target.value;
    }

    handleSearchClick() {
        fetch(QUERY_URL + this.searchKey)
            .then(response => response.json())
            .then(jsonResponse => {
                this.books = jsonResponse
            })
            .catch(error => {
                this.error = error;
                this.books = undefined;
            });
    }

}