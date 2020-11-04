import getProfiles from '@salesforce/apex/UserSearchLWC.getProfiles';
import getUserRoles from '@salesforce/apex/UserSearchLWC.getUserRoles';
import { LightningElement, track, wire } from 'lwc';
let i = 0;
export default class UserSearch extends LightningElement {

    selectedProfile;
    selectedRole;
    selectedName;

    @track
    profiles = [];
    pageErrors = '';

    @track
    rolesOptions = [];

    @wire(getProfiles) fetchProfiles({ error, data }) {

        if (data) {
            for (i = 0; i < data.length; i++) {
                this.profiles = [...this.profiles, { value: data[i].Id, label: data[i].Name }];//used the spread oparator 
            }

        } else if (error) {
            this.pageErrors += error;
        }

    }

    get profileOptions() {
        return this.profiles;
    }

    profileSelectHandler(event) {

        this.selectedProfile = event.detail.value;
        console.log('HHHHHHH ' + this.selectedProfile);
    }

    @wire(getUserRoles) fetchUserRoles({ error, data }) {

        if (data) {
            for (i = 0; i < data.length; i++) {
                this.rolesOptions = [...this.rolesOptions, { value: data[i].Id, label: data[i].Name }];//used the spread oparator 
            }
        } else if (error) {

        }

    }

    roleSelectHandler(event) {
        this.selectedRole = event.detail.value;
        console.log('jjjjjjj ' + this.selectedRole);
    }

    nameHandler(event) {
        this.selectedName = event.target.value;
        console.log('FFFFFFFFF ' + event.target.value);
    }

    searchHandler(event) {

        console.log('EEEEEEEEEEE' + this.selectedProfile);
        console.log('EEEEEEEEEEE2' + this.selectedRole);
        console.log('EEEEEEEEEEE3' + this.selectedName);
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