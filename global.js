console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// let navLinks = $$("nav a");

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname,
// );

// currentLink?.classList.add('current');


let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'https://github.com/yal103' , title: 'Profile' },
    { url: 'resume/', title: 'Resume' },
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/dsc106_portfolio/";         // GitHub Pages repo name


for (let p of pages) {
    let url = p.url;
    let title = p.title;
    // next step: create link and add it to nav
    url = !url.startsWith('http') ? BASE_PATH + url : url;
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;

    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname,
    );

    if (a.host !== location.host) {
        a.target = "_blank";
    }

    nav.append(a);
}


document.body.insertAdjacentHTML(
    'afterbegin',
    `
      <label class="color-scheme">
        Theme:
        <select>
          <option value="light dark">Automatic</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
    `
);

let select = document.querySelector('.color-scheme select');

select.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);
  document.documentElement.style.setProperty('color-scheme', event.target.value);
  localStorage.colorScheme = event.target.value
});

if ('colorScheme' in localStorage) {
    document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
    select.value = localStorage.colorScheme;
}



export async function fetchJSON(url) {
    try {
        // Fetch the JSON file from the given URL
        const response = await fetch(url);

        console.log(response)

        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}


export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    if (!containerElement) {
      console.error('renderProjects: containerElement is null');
      return;
    }

    if (!Array.isArray(projects)) {
      console.error('renderProjects: projects is not an array');
      return;
    }

    const validHeadings = ['h1','h2','h3','h4','h5','h6'];
    if (!validHeadings.includes(headingLevel)) {
      console.warn(`Invalid headingLevel "${headingLevel}", defaulting to h2`);
      headingLevel = 'h2';
    }
  
    containerElement.innerHTML = '';
  
    if (projects.length === 0) {
      containerElement.innerHTML = '<p>No projects available.</p>';
      return;
    }
  
    for (let project of projects) {
      const article = document.createElement('article');
  
      // Handle missing data safely
      const title = project.title || 'Untitled Project';
      const image = project.image || '';
      const description = project.description || 'No description available.';
  
      article.innerHTML = `
        <${headingLevel}>${title}</${headingLevel}>
        ${image ? `<img src="${image}" alt="${title}">` : ''}
        <p>${description}</p>
      `;
  
      containerElement.appendChild(article);
    }
}
