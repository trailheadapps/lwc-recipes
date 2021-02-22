import { LightningElement } from 'lwc';

export default class HelloForEach extends LightningElement {
    contacts = [
        {
            Id: '003171931112854375',
            Name: 'Amy Rebecca',
            Title: 'VP of Engineering'
        },
        {
            Id: '003192301009134555',
            Name: 'Michael Matthew',
            Title: 'VP of Sales'
        },
        {
            Id: '003848991274589432',
            Name: 'Jennifer Wu',
            Title: 'CEO of changing source code'
        },
        {
            Id: '3401375019351903712847',
            Name: 'Guy Persons',
            Title: 'Waste Management'
        },
        {
            Id: '3436938169481649123',
            Name: 'Human Man',
            Title: 'Contact Listings'
        }
    ];
}
