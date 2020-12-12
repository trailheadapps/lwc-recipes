import { LightningElement } from 'lwc';
const Column = [
    { label: 'Section 1', fieldName: 'Section1' },
    { label: 'Section 2', fieldName: 'Section2' },
    { label: 'select All', fieldName: 'isselected' }
]
export default class Child extends LightningElement {
    data = [
        { 'Section1': 'a', 'Section2': '1', 'isselected': 'false' },
        { 'Section1': 'b', 'Section2': '2', 'isselected': 'false' },
        { 'Section1': 'c', 'Section2': '3', 'isselected': 'false' },
        { 'Section1': 'd', 'Section2': '4', 'isselected': 'false' },
        { 'Section1': 'e', 'Section2': '5', 'isselected': 'false' },
    ];
}