import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// Fetch data
const projects = await fetchJSON('../lib/projects.json');

// Update title
const titleElement = document.querySelector('.projects-title');
titleElement.textContent = `Projects (${projects.length})`;

// Render projects
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

const svg = d3.select('#projects-plot');

const arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(50);

let data = [
    { value: 1, label: 'apples' },
    { value: 2, label: 'oranges' },
    { value: 3, label: 'mangos' },
    { value: 4, label: 'pears' },
    { value: 5, label: 'limes' },
    { value: 5, label: 'cherries' },
];

let colors = d3.scaleOrdinal(d3.schemeTableau10);

const sliceGenerator = d3.pie().value((d) => d.value);
const arcData = sliceGenerator(data);
const arcs = arcData.map((d) => arcGenerator(d));

arcs.forEach((arc, idx) => {
    svg.append('path')
        .attr('d', arc)
        .attr('fill', colors(idx));
});

let legend = d3.select('.legend');
data.forEach((d, idx) => {
    legend
        .append('li')
        .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
        .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
});