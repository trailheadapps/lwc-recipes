import { LightningElement } from 'lwc';

// The base URL (in this case https://www.googleapis.com/ must be added to the CSP Trusted Sites in Setup)
const QUERY_URL =
    'https://www.googleapis.com/books/v1/volumes?langRestrict=en&q=';

export default class MiscRestCall extends LightningElement {
    searchKey = 'Harry Potter';
    books;
    error;

    handleSearchKeyChange(event) {
        this.searchKey = event.target.value;
    }

    handleSearchClick() {
        // The Fetch API is currently not polyfilled for usage in IE11.
        // Use XMLHttpRequest instead in that case.
        fetch(QUERY_URL + this.searchKey)
            .then((response) => {
                // fetch isn't throwing an error if the request fails.
                // Therefore we have to check the ok property.
                if (!response.ok) {
                    this.error = response;
                }
                return response.json();
            })
            .then((jsonResponse) => {
                this.books = jsonResponse;
            })
            .catch((error) => {
                this.error = error;
                this.books = undefined;
            });
    }
}
