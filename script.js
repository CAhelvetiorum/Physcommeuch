// Loads books.json and renders it as a searchable, filterable catalog.
// No build step, no dependencies — just fetch + DOM.

const state = {
  books: [],
  search: "",
  genre: "all",
  sort: "title-asc",
};

const catalogEl = document.getElementById("catalog");
const searchInput = document.getElementById("search-input");
const genreSelect = document.getElementById("genre-select");
const sortSelect = document.getElementById("sort-select");
const countEl = document.getElementById("count-readout");

init();

async function init() {
  try {
    const res = await fetch("books.json");
    if (!res.ok) throw new Error(`Failed to load books.json (${res.status})`);
    state.books = await res.json();
  } catch (err) {
    catalogEl.innerHTML = `<p class="empty-state">Couldn't load the catalog. ${escapeHtml(
      err.message
    )}</p>`;
    return;
  }

  populateGenres(state.books);
  attachEvents();
  render();
}

function populateGenres(books) {
  const genres = [...new Set(books.map((b) => b.genre))].sort();
  for (const genre of genres) {
    const opt = document.createElement("option");
    opt.value = genre;
    opt.textContent = genre;
    genreSelect.appendChild(opt);
  }
}

function attachEvents() {
  searchInput.addEventListener("input", (e) => {
    state.search = e.target.value.trim().toLowerCase();
    render();
  });
  genreSelect.addEventListener("change", (e) => {
    state.genre = e.target.value;
    render();
  });
  sortSelect.addEventListener("change", (e) => {
    state.sort = e.target.value;
    render();
  });
}

function getFilteredSorted() {
  let list = state.books.filter((b) => {
    const matchesGenre = state.genre === "all" || b.genre === state.genre;
    const haystack = `${b.title} ${b.subtitle || ""} ${b.author}`.toLowerCase();
    const matchesSearch = state.search === "" || haystack.includes(state.search);
    return matchesGenre && matchesSearch;
  });

  const [key, dir] = state.sort.split("-");
  list.sort((a, b) => {
    let cmp;
    if (key === "title") cmp = a.title.localeCompare(b.title);
    else if (key === "author") cmp = a.author.localeCompare(b.author);
    else if (key === "year") cmp = a.year - b.year;
    return dir === "desc" ? -cmp : cmp;
  });

  return list;
}

function render() {
  const list = getFilteredSorted();
  countEl.textContent = `${list.length} of ${state.books.length} volumes`;

  if (list.length === 0) {
    catalogEl.innerHTML = `<p class="empty-state">No volumes match that search. Try another title or author.</p>`;
    return;
  }

  catalogEl.innerHTML = list.map(cardTemplate).join("");
}

function cardTemplate(book) {
  const subtitle = book.subtitle
    ? `<p class="subtitle">${escapeHtml(book.subtitle)}</p>`
    : "";

  return `
    <article class="card" style="--spine-color: ${escapeHtml(book.spine || "#8a6d3b")}">
      <span class="call-number">No. ${escapeHtml(book.id)} · ${escapeHtml(book.language)}</span>
      <h2>${escapeHtml(book.title)}</h2>
      ${subtitle}
      <p class="byline">${escapeHtml(book.author)}</p>
      <div class="meta-row">
        <span class="tag">${escapeHtml(book.genre)}</span>
        <span class="tag">${escapeHtml(String(book.pages))} pp.</span>
        <span class="tag">${escapeHtml(book.condition)}</span>
      </div>
      <p class="note">${escapeHtml(book.note)}</p>
      <span class="stamp">${escapeHtml(String(book.year))}</span>
    </article>
  `;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
