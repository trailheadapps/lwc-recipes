import getProfiles from '@salesforce/apex/UserSearchLWC.getProfiles';
import { LightningElement, track, wire } from 'lwc';
let i = 0;
export default class UserSearch extends LightningElement {

    selectedProfile;

    @track
    profiles = [];
    selectOption = {};

    pros = [];
    @wire(getProfiles) fetchProfiles({ error, data }) {

        if (data) {
            for (i = 0; i < data.length; i++) {
                console.log('DDDDDD ' + data[i].Id);
                this.profiles = [...this.profiles, { value: data[i].Id, label: data[i].Name }];
            }

        } else if (error) {
            console.log('EEEEEEEEE')
        }

        /*
        for (let key in JSON.parse(result.data)) {
            // console.log('Profile Name ' + result.data[key].Id + ' ' + result.data[key].Name);
            // this.profiles.push({ label: result.data[key].Id, value: result.data[key].Name });
            // this.selectOption = { label: result.data[key].Id, value: result.data[key].Name };
            // console.log('LLLLLLLLL ' + JSON.stringify(selectOption));
            this.profiles.push({ key: key, value: result.data[key] });
        }
        this.profiles.push({ label: 'New', value: 'new' })
        console.log('FFFFFFF ' + JSON.stringify(this.profiles));
        */
    }

    get profileOptions() {
        return this.profiles;
    }
    // fetchProfiles() {
    //     getProfiles()
    //         .then(
    //             result => {
    //                 console.log('DDDDDDDDD ' + result)
    //             }
    //         )
    //         .catch();
    // }

}