/* global d3 */
import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
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

import D3 from '@salesforce/resourceUrl/d3';
import DATA from './data';

export default class LibsD3 extends LightningElement {
    svgWidth = 400;
    svgHeight = 400;

    d3Initialized = false;

    async renderedCallback() {
        if (this.d3Initialized) {
            return;
        }
        this.d3Initialized = true;

        try {
            await Promise.all([
                loadScript(this, D3 + '/d3.v5.min.js'),
                loadStyle(this, D3 + '/style.css')
            ]);
            this.initializeD3();
        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading D3',
                    message: error.message,
                    variant: 'error'
                })
            );
        }
    }

    initializeD3() {
        // Example adopted from https://bl.ocks.org/mbostock/2675ff61ea5e063ede2b5d63c08020c7
        const svg = d3.select(this.template.querySelector('svg.d3'));
        const width = this.svgWidth;
        const height = this.svgHeight;
        const color = d3.scaleOrdinal(d3.schemeDark2);

        const simulation = d3
            .forceSimulation()
            .force(
                'link',
                d3.forceLink().id((d) => {
                    return d.id;
                })
            )
            .force('charge', d3.forceManyBody())
            .force('center', d3.forceCenter(width / 2, height / 2));

        const link = svg
            .append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(DATA.links)
            .enter()
            .append('line')
            .attr('stroke-width', (d) => {
                return Math.sqrt(d.value);
            });

        const node = svg
            .append('g')
            .attr('class', 'nodes')
            .selectAll('circle')
            .data(DATA.nodes)
            .enter()
            .append('circle')
            .attr('r', 5)
            .attr('fill', (d) => {
                return color(d.group);
            })
            .call(
                d3
                    .drag()
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended)
            );

        node.append('title').text((d) => {
            return d.id;
        });

        simulation.nodes(DATA.nodes).on('tick', ticked);

        simulation.force('link').links(DATA.links);

        function ticked() {
            link.attr('x1', (d) => d.source.x)
                .attr('y1', (d) => d.source.y)
                .attr('x2', (d) => d.target.x)
                .attr('y2', (d) => d.target.y);
            node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
        }

        function dragstarted(d) {
            if (!d3.event.active) {
                simulation.alphaTarget(0.3).restart();
            }
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) {
                simulation.alphaTarget(0);
            }
            d.fx = null;
            d.fy = null;
        }
    }
}
