/* ============================================================
   Catalogue of Early Printed Books — behaviour
   Loads books.json, renders the table, and handles
   sorting, free-text search, and column filters.
   ============================================================ */

// Column definitions: key must match the property names in books.json
const COLUMNS = [
  { key: "id",             label: "ID",                                numeric: true  },
  { key: "author",         label: "Author"                                            },
  { key: "title",          label: "Title"                                             },
  { key: "editor",         label: "Editor / Commentator / Contributor"                },
  { key: "place",          label: "Place"                                             },
  { key: "printer",        label: "Printer"                                           },
  { key: "year",           label: "Year",                              numeric: true  },
  { key: "format",         label: "Format"                                            },
  { key: "language",       label: "Language"                                          },
  { key: "istc",           label: "ISTC No."                                          },
  { key: "ustc",           label: "USTC No."                                          },
  { key: "digitalization", label: "Digitalization(s)"                                 },
  { key: "notes",          label: "Notes"                                             },
  { key: "confession",     label: "Confession"                                        },
  { key: "university",     label: "University / Academy / School"                     },
  { key: "typology",       label: "Typology"                                          }
];

// Filters that get an auto-populated dropdown, mapped to their <select> id
const SELECT_FILTERS = [
  { key: "place",       id: "filter-place"       },
  { key: "printer",     id: "filter-printer"     },
  { key: "language",    id: "filter-language"    },
  { key: "confession",  id: "filter-confession"  },
  { key: "university",  id: "filter-university"  },
  { key: "typology",    id: "filter-typology"    },
  { key: "format",      id: "filter-format"      }
];

let allBooks = [];
let sortState = { key: "id", direction: "asc" };

document.addEventListener("DOMContentLoaded", init);

async function init() {
  buildTableHead();
  wireControls();

  try {
    const res = await fetch("books.json");
    allBooks = await res.json();
  } catch (err) {
    document.getElementById("no-results").hidden = false;
    document.getElementById("no-results").textContent =
      "Could not load books.json. Make sure the file exists alongside index.html.";
    return;
  }

  populateSelectFilters();
  renderTable();
}

/* ---------- Table head ---------- */

function buildTableHead() {
  const row = document.getElementById("table-head-row");
  row.innerHTML = "";
  COLUMNS.forEach(col => {
    const th = document.createElement("th");
    th.dataset.key = col.key;
    th.innerHTML = `${escapeHtml(col.label)} <span class="arrow"></span>`;
    th.addEventListener("click", () => {
      if (sortState.key === col.key) {
        sortState.direction = sortState.direction === "asc" ? "desc" : "asc";
      } else {
        sortState.key = col.key;
        sortState.direction = "asc";
      }
      renderTable();
    });
    row.appendChild(th);
  });
}

function updateSortArrows() {
  document.querySelectorAll("#table-head-row th").forEach(th => {
    const arrow = th.querySelector(".arrow");
    if (th.dataset.key === sortState.key) {
      arrow.textContent = sortState.direction === "asc" ? "▲" : "▼";
    } else {
      arrow.textContent = "";
    }
  });
}

/* ---------- Filter controls ---------- */

function wireControls() {
  document.getElementById("search-box").addEventListener("input", renderTable);
  document.getElementById("filter-year-min").addEventListener("input", renderTable);
  document.getElementById("filter-year-max").addEventListener("input", renderTable);

  SELECT_FILTERS.forEach(f => {
    document.getElementById(f.id).addEventListener("change", renderTable);
  });

  document.getElementById("toggle-filters").addEventListener("click", () => {
    const panel = document.getElementById("filter-panel");
    const btn = document.getElementById("toggle-filters");
    const isHidden = panel.hasAttribute("hidden");
    if (isHidden) {
      panel.removeAttribute("hidden");
      btn.setAttribute("aria-expanded", "true");
      btn.textContent = "Advanced filters ▴";
    } else {
      panel.setAttribute("hidden", "");
      btn.setAttribute("aria-expanded", "false");
      btn.textContent = "Advanced filters ▾";
    }
  });

  document.getElementById("reset-filters").addEventListener("click", () => {
    document.getElementById("search-box").value = "";
    document.getElementById("filter-year-min").value = "";
    document.getElementById("filter-year-max").value = "";
    SELECT_FILTERS.forEach(f => {
      document.getElementById(f.id).value = "";
    });
    renderTable();
  });
}

function populateSelectFilters() {
  SELECT_FILTERS.forEach(f => {
    const select = document.getElementById(f.id);
    const values = new Set();
    allBooks.forEach(book => {
      const raw = book[f.key];
      if (!raw) return;
      // A field like "Latin; Greek" contributes each part separately
      String(raw).split(";").forEach(part => {
        const v = part.trim();
        if (v) values.add(v);
      });
    });
    [...values].sort((a, b) => a.localeCompare(b)).forEach(v => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      select.appendChild(opt);
    });
  });
}

/* ---------- Filtering + sorting + rendering ---------- */

function getFilteredBooks() {
  const search = document.getElementById("search-box").value.trim().toLowerCase();
  const yearMin = document.getElementById("filter-year-min").value;
  const yearMax = document.getElementById("filter-year-max").value;

  const selectValues = {};
  SELECT_FILTERS.forEach(f => {
    selectValues[f.key] = document.getElementById(f.id).value;
  });

  return allBooks.filter(book => {
    if (search) {
      const haystack = COLUMNS.map(c => book[c.key] ?? "").join(" ").toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    if (yearMin && Number(book.year) < Number(yearMin)) return false;
    if (yearMax && Number(book.year) > Number(yearMax)) return false;

    for (const f of SELECT_FILTERS) {
      const wanted = selectValues[f.key];
      if (!wanted) continue;
      const cellValue = String(book[f.key] ?? "");
      const parts = cellValue.split(";").map(p => p.trim());
      if (!parts.includes(wanted)) return false;
    }

    return true;
  });
}

function sortBooks(books) {
  const { key, direction } = sortState;
  const col = COLUMNS.find(c => c.key === key);
  const factor = direction === "asc" ? 1 : -1;

  return [...books].sort((a, b) => {
    let va = a[key];
    let vb = b[key];

    if (col && col.numeric) {
      va = Number(va) || 0;
      vb = Number(vb) || 0;
      return (va - vb) * factor;
    }

    va = String(va ?? "").toLowerCase();
    vb = String(vb ?? "").toLowerCase();
    return va.localeCompare(vb) * factor;
  });
}

function renderTable() {
  const filtered = sortBooks(getFilteredBooks());
  const tbody = document.getElementById("table-body");
  const noResults = document.getElementById("no-results");
  tbody.innerHTML = "";

  document.getElementById("result-count").textContent =
    `${filtered.length} entr${filtered.length === 1 ? "y" : "ies"}`;

  if (filtered.length === 0) {
    noResults.hidden = false;
    noResults.textContent = "No entries match the current search and filters.";
  } else {
    noResults.hidden = true;
  }

  const fragment = document.createDocumentFragment();
  filtered.forEach(book => {
    const tr = document.createElement("tr");
    COLUMNS.forEach(col => {
      const td = document.createElement("td");
      if (col.key === "title") td.classList.add("title-cell");
      if (col.key === "notes") td.classList.add("notes-cell");

      if (col.key === "digitalization") {
        td.innerHTML = formatDigitalization(book[col.key]);
      } else {
        td.textContent = book[col.key] ?? "";
      }
      tr.appendChild(td);
    });
    fragment.appendChild(tr);
  });
  tbody.appendChild(fragment);

  updateSortArrows();
}

/* ---------- Helpers ---------- */

function formatDigitalization(value) {
  if (!value) return "";
  return String(value)
    .split(";")
    .map(part => part.trim())
    .filter(Boolean)
    .map(part => {
      if (/^https?:\/\//i.test(part)) {
        return `<a href="${escapeAttr(part)}" target="_blank" rel="noopener">link</a>`;
      }
      return escapeHtml(part);
    })
    .join(", ");
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, "&quot;");
}
