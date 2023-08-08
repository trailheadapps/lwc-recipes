import { LightningElement } from 'lwc';
import chartjs from '@salesforce/resourceUrl/chartJs';
import { loadScript } from 'lightning/platformResourceLoader';
/**
 * When using this component in an LWR site, please import the below custom implementation of 'loadScript' module
 * instead of the one from 'lightning/platformResourceLoader'
 *
 * import { loadScript } from 'c/resourceLoader';
 *
 * This workaround is implemented to get around a limitation of the Lightning Locker library in LWR sites.
 * Read more about it in the "Lightning Locker Limitations" section of the documentation
 * https://developer.salesforce.com/docs/atlas.en-us.exp_cloud_lwr.meta/exp_cloud_lwr/template_limitations.htm
 */

const generateRandomNumber = () => {
    return Math.round(Math.random() * 100);
};

export default class LibsChartjs extends LightningElement {
    error;
    chart;
    chartjsInitialized = false;

    config = {
        type: 'doughnut',
        data: {
            datasets: [
                {
                    data: [
                        generateRandomNumber(),
                        generateRandomNumber(),
                        generateRandomNumber(),
                        generateRandomNumber(),
                        generateRandomNumber()
                    ],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)'
                    ],
                    label: 'Dataset 1'
                }
            ],
            labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue']
        },
        options: {
            responsive: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };

    async renderedCallback() {
        if (this.chartjsInitialized) {
            return;
        }
        this.chartjsInitialized = true;

        try {
            await loadScript(this, chartjs);
            const canvas = document.createElement('canvas');
            this.template.querySelector('div.chart').appendChild(canvas);
            const ctx = canvas.getContext('2d');
            this.chart = new window.Chart(ctx, this.config);
        } catch (error) {
            this.error = error;
        }
    }
}
