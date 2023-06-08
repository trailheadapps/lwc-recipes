import { LightningElement } from 'lwc';

export default class ApiSpread extends LightningElement {
    props = {
        firstName: 'Amy',
        lastName: 'Taylor'
    };

    handleChange(event) {
        const field = event.target.name;
        if (field === 'firstName') {
            this.props = {
                firstName: event.target.value,
                lastName: this.props.lastName
            };
        } else if (field === 'lastName') {
            this.props = {
                firstName: this.props.firstName,
                lastName: event.target.value
            };
        }
    }
}
