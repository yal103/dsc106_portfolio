import { fetchJSON, renderProjects } from "../global.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

// Fetch data
const projects = await fetchJSON("../lib/projects.json");

let rolledData = d3.rollups(
  projects,
  (v) => v.length,
  (d) => d.year
);

// Update title
const titleElement = document.querySelector(".projects-title");
titleElement.textContent = `Projects (${projects.length})`;

// Render projects
const projectsContainer = document.querySelector(".projects");
renderProjects(projects, projectsContainer, "h2");

const svg = d3.select("#projects-plot");

const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

let data = rolledData.map(([year, count]) => {
  return { value: count, label: year };
});

let colors = d3.scaleOrdinal(d3.schemeTableau10);

let selectedIndex = -1;

let query = "";
let searchInput = document.querySelector(".searchBar");

function renderPieChart(projectsGiven) {
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  let newSliceGenerator = d3.pie().value((d) => d.value);

  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => arcGenerator(d));

  svg.selectAll("path").remove();
  d3.select(".legend").selectAll("li").remove();

  newArcs.forEach((arc, i) => {
    svg
      .append("path")
      .attr("d", arc)
      .attr("fill", colors(i))
      .attr("class", selectedIndex === i ? "selected" : "")
      .on("click", () => {
        selectedIndex = selectedIndex === i ? -1 : i;

        svg
          .selectAll("path")
          .attr("class", (_, idx) => (selectedIndex === idx ? "selected" : ""));

        d3.select(".legend")
          .selectAll("li")
          .attr("class", (_, idx) =>
            idx === selectedIndex ? "legend-item selected" : "legend-item"
          );
        if (selectedIndex === -1) {
          renderProjects(projectsGiven, projectsContainer, "h2");
        } else {
          const selectedYear = newData[selectedIndex].label;

          const filteredProjects = projectsGiven.filter(
            (project) => project.year === selectedYear
          );

          renderProjects(filteredProjects, projectsContainer, "h2");
        }
      });
  });

  let legend = d3.select(".legend");

  newData.forEach((d, idx) => {
    legend
      .append("li")
      .attr("style", `--color: ${colors(idx)}`)
      .attr(
        "class",
        idx === selectedIndex ? "legend-item selected" : "legend-item"
      )
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

renderPieChart(projects);

searchInput.addEventListener("input", (event) => {
  query = event.target.value;

  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join("\n").toLowerCase();
    return values.includes(query.toLowerCase());
  });

  renderProjects(filteredProjects, projectsContainer, "h2");
  renderPieChart(filteredProjects);
});
