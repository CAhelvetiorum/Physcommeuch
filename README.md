# The Archive — a small book catalog for GitHub Pages

A static, no-build site that lists a personal catalog of old books. Search, filter by genre, and sort — all client-side, no server needed.

## Files

- `index.html` — page structure and controls
- `styles.css` — the card-catalog / old-library visual design
- `script.js` — loads `books.json` and renders the cards
- `books.json` — your book data (edit this to add/remove books)

## Adding a book

Open `books.json` and add an entry to the array, e.g.:

```json
{
  "id": "011",
  "title": "Book Title",
  "subtitle": "",
  "author": "Author Name",
  "year": 1900,
  "genre": "Genre",
  "language": "English",
  "pages": 300,
  "condition": "Good — short note on condition",
  "note": "A personal note about this copy.",
  "spine": "#3F5449"
}
```

`spine` is any hex color — it shows as the stripe along the top of the card.

## Running locally

Because the page loads `books.json` with `fetch`, opening `index.html` directly (`file://`) will fail in most browsers due to CORS restrictions on local files. Serve it instead:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Publishing to GitHub Pages

1. Create a new repository on GitHub (e.g. `old-books-catalog`).
2. Push these four files (`index.html`, `styles.css`, `script.js`, `books.json`) to the repo's root, on the `main` branch.
3. On GitHub, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Set **Branch** to `main` and folder to `/ (root)`, then **Save**.
6. Wait a minute or two — GitHub will publish the site at:
   `https://<your-username>.github.io/<repo-name>/`

Any future edits to `books.json` (adding a book, fixing a note) just need a normal commit + push; the live site updates automatically.
