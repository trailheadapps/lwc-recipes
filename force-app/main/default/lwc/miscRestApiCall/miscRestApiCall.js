import { LightningElement } from 'lwc';

// The base URL (in this case https://www.googleapis.com/ must be added to the CSP Trusted Sites in Setup)
const QUERY_URL =
    'https://www.googleapis.com/books/v1/volumes?langRestrict=en&q=';

export default class MiscRestCall extends LightningElement {
    searchKey = 'Harry Potter';
    books;
    error;
    isLoading = false;

    handleSearchKeyChange(event) {
        this.searchKey = event.target.value;
    }

    async handleSearchClick() {
        try {
            this.isLoading = true;
            const response = await fetch(QUERY_URL + this.searchKey);
            // fetch isn't throwing an error if the request fails.
            // Therefore we have to check the ok property.
            // The thrown error will be caught on the catch() method
            if (!response.ok) {
                throw Error(response);
            }
            this.books = await response.json();
        } catch (error) {
            this.error = error;
            this.books = undefined;
        } finally {
            // Remove spinner once we're done regardless of whether the operation succeeded or not
            this.isLoading = false;
        }
    }
}
