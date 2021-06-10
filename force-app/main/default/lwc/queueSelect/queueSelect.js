import getQueues from '@salesforce/apex/QueueUtil.getQueues';
import { api, LightningElement, track, wire } from 'lwc';

export default class QueueSelect extends LightningElement {

    @api users = [];
    // @track queues = [];

    // @wire(getQueues) loadQueues({ data, error }) {

    //     if (data) {

    //         console.log('PPPPPPPPPPPPPPP ' + JSON.stringify(data));
    //         // this.queues = [this.queues,{Id:data.Id}]

    //         // for (let queue in data) {
    //         //     console.log('NNNNN ' + queue);
    //         // }

    //     } else if (error) {

    //     }

    // }

}