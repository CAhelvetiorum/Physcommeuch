# Catalogue of Early Printed Books

## Files
- `index.html` — page structure
- `styles.css` — sober black-and-white academic styling (Times New Roman)
- `script.js` — sorting, search, and filtering logic
- `books.json` — your data. This is the only file you edit to add books.

## Adding a book
Open `books.json` and copy one entry, giving it a new, unique `id`. Leave any field
as `""` if you don't have that information yet.

```json
{
  "id": 4,
  "author": "Author",
  "title": "Full title",
  "editor": "",
  "place": "City",
  "printer": "Printer name",
  "year": 1550,
  "format": "8°",
  "language": "Latin",
  "istc": "",
  "ustc": "",
  "digitalization": "https://www.e-rara.ch/example",
  "notes": "",
  "confession": "Lutheran",
  "subconfession": "sec/ben/carm/dom/aug/fran/jes/lay" # for catholics
  "university/academy": "University of Wittenberg",
  "typology": "Commentary"
}
```

Notes on filling it in:
- Keep `id` as a plain number, and `year` as a plain number (no "c." or "s.d." — put
  uncertain dates in `notes` instead, and leave `year` blank or approximate).
- If a book has more than one language, printer variant, etc. that you want to be
  filterable separately, separate the values with a semicolon, e.g. `"Latin; Greek"`.
  The filter dropdowns and search will treat each part on its own.
- `digitalization` can hold one or more URLs separated by semicolons; each one
  that starts with `http://` or `https://` becomes a clickable "link" in the table.
- Don't forget the comma between entries, and make sure the last entry in the file
  has no trailing comma. Any plain-text JSON editor (or VS Code) works; VS Code will
  flag syntax errors as you type.


## How the search and filters work
- The search box matches against every column at once (author, title, printer,
  place, notes, etc.).
- "Advanced filters" adds a year range plus dropdown filters for place, printer,
  language, confession, university/academy/school, typology, and format. These
  dropdowns are built automatically from whatever values appear in `books.json`,
  so you never edit them by hand.
- Clicking any column heading sorts the table by that column; clicking again
  reverses the order.
