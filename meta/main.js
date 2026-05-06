import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

async function loadData() {
  const data = await d3.csv("loc.csv", (row) => ({
    ...row,
    line: Number(row.line),
    depth: Number(row.depth),
    length: Number(row.length),
    date: new Date(row.date + "T00:00" + row.timezone),
    datetime: new Date(row.datetime),
  }));

  return data;
}

function processCommits(data) {
  return d3
    .groups(data, (d) => d.commit)
    .map(([commit, lines]) => {
      let first = lines[0];

      let { author, date, time, timezone, datetime } = first;

      let ret = {
        id: commit,
        url: "https://github.com/yal103/dsc106_portfolio/commit/" + commit,
        author,
        date,
        time,
        timezone,
        datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length,
      };

      Object.defineProperty(ret, "lines", {
        value: lines,
        configurable: false,
        writable: false,
        enumerable: false,
      });

      return ret;
    });
}

function renderCommitInfo(data, commits) {
  const stats = d3.select("#stats");

  stats.selectAll("*").remove();

  const dl = stats.append("dl").attr("class", "stats");

  function addStat(label, value) {
    const stat = dl.append("div");

    stat.append("dt").html(label);
    stat.append("dd").text(value);
  }

  const numberOfFiles = d3.group(data, (d) => d.file).size;

  const maxDepth = d3.max(data, (d) => d.depth);

  const averageLineLength = d3.mean(data, (d) => d.length);

  const longestLine = d3.greatest(data, (d) => d.length);

  const fileLengths = d3.rollups(
    data,
    (v) => d3.max(v, (d) => d.line),
    (d) => d.file
  );

  const averageFileLength = d3.mean(fileLengths, (d) => d[1]);

  const longestFile = d3.greatest(fileLengths, (d) => d[1]);

  const workByPeriod = d3.rollups(
    data,
    (v) => v.length,
    (d) => d.datetime.toLocaleString("en", { dayPeriod: "short" })
  );

  const maxPeriod = d3.greatest(workByPeriod, (d) => d[1])?.[0];

  addStat('Total <abbr title="Lines of code">LOC</abbr>', data.length);
  addStat("Total commits", commits.length);
  addStat("Files", numberOfFiles);
  addStat("Max depth", maxDepth);
  addStat("Longest line", `${longestLine.length}`);
  addStat("Average file length", averageFileLength.toFixed(1));
  addStat("Longest file", longestFile[0]);
  addStat("Most work done", maxPeriod);
}

let data = await loadData();
let commits = processCommits(data);

renderCommitInfo(data, commits);
