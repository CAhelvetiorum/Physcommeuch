# Aristotle's Physics: Editions and Commentaries

## Site structure
- `index.html` — home page, with links to both databases.
- `commentaries.html` + `commentaries.json` — the database of commentaries, quaestiones,
  theses, and lecture notes.
- `editions.html` + `editions.json` — the database of editions and Latin translations.
- `script.js` — shared logic (sorting, search, filtering) used by both database pages.
  Each page tells it which file to load via `<body data-source="....json">`.
- `styles.css` — shared styling for all three pages (Times New Roman, black-and-white,
  academic register), including the navigation bar at the top of each database page.

Both database pages read the same `COLUMNS` list in `script.js`, so they always show the
same set of columns and filters. If you want the two databases to have different columns
one day, that would mean splitting `script.js` into two versions — ask if you want that.

## Adding a book
Open `commentaries.json` or `editions.json` and copy one entry, giving it a new, unique
`id` (ids only need to be unique *within* their own file, not across both databases).
Leave any field as `""` if you don't have that information yet.

```json
{
  "id": 11,
  "author": "Author, First",
  "title": "Full title",
  "editor": "",
  "place": "City",
  "printer": "Printer name",
  "year": 1550,
  "format": "8°",
  "medium": "Printed",
  "language": "Latin",
  "istc": "",
  "ustc": "",
  "location": "",
  "digitalization": "https://example.org/scan",
  "notes": "",
  "confession": "Lutheran",
  "subconfession": "-",
  "university": "University of Wittenberg",
  "typology": "Commentary"
}
```

Notes on filling it in:
- Keep `id` as a plain number. Keep `year` as a plain number too, and leave it as `""`
  if unknown — do not leave the value blank after the colon (`"year": ,` is invalid JSON
  and will break the whole file). Put uncertain or approximate dates ("ca. 1650?") in
  `notes` instead.
- `subconfession` is meant for Catholic sub-groups (e.g. `sec`, `ben`, `carm`, `dom`,
  `aug`, `fran`, `jes`, `lay`) — use `-` when not applicable, and `?` when unknown.
- `medium` distinguishes `"Printed"` from `"Manuscript"` entries.
- `location` is for manuscripts or unique copies (repository and shelfmark), separate
  from `digitalization`, which is for links to online scans.
- If a book has more than one language, printer variant, etc. that you want to be
  filterable separately, separate the values with a semicolon, e.g. `"Latin; Greek"`.
  The filter dropdowns and search will treat each part on its own.
- `digitalization` can hold one or more URLs separated by semicolons; each one
  that starts with `http://` or `https://` becomes a clickable "link" in the table.
- Don't forget the comma between entries, and make sure the last entry in the file has
  no trailing comma. Any plain-text JSON editor (or VS Code) works; VS Code will flag
  syntax errors as you type — a red underline anywhere in the file means something needs
  fixing before the page will load correctly.

## Adding a third database later
1. Duplicate `commentaries.html` and `commentaries.json`, rename both (e.g.
   `secondary-sources.html` / `secondary-sources.json`).
2. In the new HTML file, change `<body data-source="...">` to point at the new JSON
   file, update the `<title>` and `<h1>`, and add a link to it in the `<nav>` block of
   *every* page (home page and both existing database pages), and add the new page's own
   `<nav>` block with links back to the others.
3. Add a card for it on `index.html` inside `.database-links`.

## Publishing on GitHub Pages
1. Push all the files at the root of a GitHub repository (no subfolders needed).
2. Go to the repository's **Settings → Pages**.
3. Under "Build and deployment", set Source to **Deploy from a branch**, choose the
   `main` branch and `/ (root)` folder, then save.
4. GitHub will give you a URL like `https://yourusername.github.io/your-repo/`, which
   opens on `index.html` (the home page) by default.

## How the search and filters work
- The search box matches against every column at once (author, title, printer, place,
  notes, etc.), within whichever database you're currently viewing.
- "Advanced filters" adds a year range plus dropdown filters for place, printer,
  language, confession, sub-confession, university/academy/school, typology, format,
  and medium. These dropdowns are built automatically from whatever values appear in the
  relevant `.json` file, so you never edit them by hand.
- Clicking any column heading sorts the table by that column; clicking again reverses
  the order.
