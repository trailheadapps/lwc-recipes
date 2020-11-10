import getProfiles from '@salesforce/apex/UserSearchLWC.getProfiles';
import getUserRoles from '@salesforce/apex/UserSearchLWC.getUserRoles';
import searchUsers from '@salesforce/apex/UserSearchLWC.searchUsers';
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

        searchUsers({ profileId: this.selectedProfile, roleId: this.selectedRole, name: this.selectedName }).
            then(result => {
                if (result && result.length > 0 && Array.isArray(result)) {
                    console.log('KDDDDDKKK ' + JSON.stringify(result));
                    const searchEvent = new CustomEvent('usersearch', { detail: { data: result } });

                    console.log('This is before the user search trigger the event');
                    this.dispatchEvent(searchEvent);
                    console.log('uuuuuuu')

                } else {// No Results found


                }

            }).
            catch(error => {
                console.log('ERROR');
            });


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