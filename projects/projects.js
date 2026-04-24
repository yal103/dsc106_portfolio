import { fetchJSON, renderProjects } from '../global.js';

// Fetch data
const projects = await fetchJSON('../lib/projects.json');

// Update title
const titleElement = document.querySelector('.projects-title');
titleElement.textContent = `Projects (${projects.length})`;

// Render projects
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');